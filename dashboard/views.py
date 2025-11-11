from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.utils import timezone
from django.db.models import Count, Sum, Q
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from datetime import timedelta
import json

from .models import GymCheckIn, DashboardStats
from memberships.models import Member
from payments.models import Payment

@login_required
def dashboard(request):
    today = timezone.now().date()
    now = timezone.now()
    
    # Get today's check-ins
    today_check_ins = GymCheckIn.objects.filter(date=today)
    
    # Daily walk-ins (members who checked in today)
    daily_walk_ins = today_check_ins.values('member').distinct().count()
    
    # Total check-ins today
    total_check_ins_today = today_check_ins.count()
    
    # Active members currently in gym (checked in but not checked out)
    active_in_gym = today_check_ins.filter(check_out_time__isnull=True).count()
    
    # Monthly statistics
    month_start = today.replace(day=1)
    monthly_check_ins = GymCheckIn.objects.filter(
        date__gte=month_start,
        date__lte=today
    ).values('member').distinct().count()
    
    # Total active members
    total_active_members = Member.objects.filter(is_active=True).count()
    
    # New members this month
    new_members_this_month = Member.objects.filter(
        date_created__gte=month_start,
        date_created__lte=now
    ).count()
    
    # Revenue statistics
    today_revenue = Payment.objects.filter(
        payment_date__date=today,
        status='Completed'
    ).aggregate(total=Sum('amount'))['total'] or 0
    
    monthly_revenue = Payment.objects.filter(
        payment_date__gte=month_start,
        payment_date__lte=now,
        status='Completed'
    ).aggregate(total=Sum('amount'))['total'] or 0
    
    # Recent check-ins (last 10)
    recent_check_ins = today_check_ins.select_related('member')[:10]
    
    # Membership expiring soon (within 3 days)
    expiring_soon = Member.objects.filter(
        is_active=True,
        end_date__gte=today,
        end_date__lte=today + timedelta(days=3)
    ).count()
    
    # Peak hours data (check-ins by hour today)
    peak_hours = today_check_ins.extra(
        select={'hour': 'EXTRACT(hour FROM check_in_time)'}
    ).values('hour').annotate(count=Count('id')).order_by('hour')
    
    # Calculate percentages for chart visualization
    max_count = max([h['count'] for h in peak_hours], default=1)
    peak_hours_data = []
    for h in peak_hours:
        peak_hours_data.append({
            'hour': int(h['hour']),
            'count': h['count'],
            'percentage': (h['count'] / max_count * 100) if max_count > 0 else 10
        })
    
    context = {
        'daily_walk_ins': daily_walk_ins,
        'monthly_check_ins': monthly_check_ins,
        'active_in_gym': active_in_gym,
        'today_revenue': today_revenue,
        'monthly_revenue': monthly_revenue,
        'active_members': total_active_members,
        'expiring_soon': expiring_soon,
        'new_members': new_members_this_month,
        'recent_check_ins': recent_check_ins,
        'peak_hours': peak_hours_data,
        'current_time': now,
    }
    
    return render(request, "dashboard/dashboard.html", context)


@login_required
@require_http_methods(["GET"])
def search_active_members(request):
    """Search for active and expiring members for check-in"""
    query = request.GET.get('q', '').strip()
    
    if len(query) < 2:
        return JsonResponse({'members': []})
    
    today = timezone.now().date()
    expiring_threshold = today + timedelta(days=7)
    
    # Search active members or members expiring within 7 days
    members = Member.objects.filter(
        is_deleted=False,
        end_date__gte=today  # Not expired yet
    ).filter(
        Q(member_id__icontains=query) |
        Q(name__icontains=query)
    )[:10]
    
    results = []
    for member in members:
        # Determine status
        if member.end_date < today:
            continue  # Skip expired
        elif member.end_date <= expiring_threshold:
            status = 'expiring'
        else:
            status = 'active'
        
        results.append({
            'member_id': member.member_id,
            'name': member.name,
            'status': status
        })
    
    return JsonResponse({'members': results})


@login_required
@require_http_methods(["POST"])
def log_checkin(request):
    """Log a member check-in"""
    try:
        data = json.loads(request.body)
        member_id = data.get('member_id')
        
        if not member_id:
            return JsonResponse({'success': False, 'error': 'Member ID is required'})
        
        # Get member
        try:
            member = Member.objects.get(member_id=member_id, is_deleted=False)
        except Member.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Member not found'})
        
        # Check if member is active or expiring soon
        today = timezone.now().date()
        if member.end_date < today:
            return JsonResponse({'success': False, 'error': 'Member membership has expired'})
        
        # Check if already checked in today
        existing_checkin = GymCheckIn.objects.filter(
            member=member,
            date=today,
            check_out_time__isnull=True
        ).first()
        
        if existing_checkin:
            return JsonResponse({'success': False, 'error': 'Member is already checked in'})
        
        # Create check-in record
        GymCheckIn.objects.create(member=member)
        
        return JsonResponse({'success': True})
        
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})
