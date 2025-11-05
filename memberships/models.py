from django.db import models
from django.conf import settings
from django.utils import timezone

class MembershipConfig(models.Model):
    membership_fee = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        help_text="Monthly membership fee that can only be modified by the owner"
    )
    last_modified = models.DateTimeField(auto_now=True)
    modified_by = models.ForeignKey(
        'users.StaffUser',
        on_delete=models.SET_NULL,
        null=True,
        limit_choices_to={'role': 'Owner'},
        related_name='fee_modifications'
    )

    class Meta:
        verbose_name = "Membership Configuration"
        verbose_name_plural = "Membership Configuration"

class Member(models.Model):    
    SEX_CHOICES = [
        ('Male', 'Male'),
        ('Female', 'Female'),
    ]
    
    # Basic Member Information
    member_id = models.CharField(
        max_length=10, 
        unique=True, 
        editable=False,
        help_text='Auto-generated unique member ID'
    )
    name = models.CharField(max_length=150)
    email = models.EmailField(null=True, blank=True)
    phone_number = models.CharField(max_length=15)
    sex = models.CharField(max_length=10, choices=SEX_CHOICES, null=True, blank=True)
    
    # Contact & Emergency Information
    address = models.TextField()
    emergency_contact = models.CharField(max_length=100)
    emergency_phone = models.CharField(max_length=15)
    
    # Membership details
    start_date = models.DateField()
    end_date = models.DateField()
    membership_fee = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        help_text="Monthly fee at the time of registration/renewal"
    )
    is_active = models.BooleanField(default=True)
    
    # Record Management
    created_by = models.ForeignKey(
        'users.StaffUser',
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_members',
        help_text='The staff/owner who created this member'
    )
    date_created = models.DateTimeField(auto_now_add=True)
        
    #Check if the membership is still valid.
    def is_membership_active(self):
        today = timezone.now().date()
        return self.is_active and self.start_date <= today <= self.end_date
    
    # Update membership period and record last subscription.
    def renew_membership_plan(self, new_membership_plan):
        if not new_membership_plan:
            return

        # Record previous plan
        self.last_membership_plan = self.membership_plan
        self.membership_plan = new_membership_plan
        self.start_date = timezone.now().date()

        # Extend end_date based on plan duration
        self.end_date = self.start_date + timezone.timedelta(days=new_membership_plan.duration_days)
        self.is_active = True
        self.save()
        
    def __str__(self):
        return f"Membership for {self.member.username}"
