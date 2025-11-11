/**
 * Dashboard JavaScript - Real-time Clock and Features
 */

// Update clock every second
function updateClock() {
    const clockElement = document.getElementById('currentTime');
    if (!clockElement) return;

    const now = new Date();
    
    // Format: January 15, 2024 - 02:30 PM
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    };
    
    const formattedTime = now.toLocaleString('en-US', options).replace(',', ' -');
    clockElement.textContent = formattedTime;
}

// Initialize clock
document.addEventListener('DOMContentLoaded', () => {
    // Update immediately
    updateClock();
    
    // Update every second
    setInterval(updateClock, 1000);
    
    // Animate stat cards on load
    animateStatCards();
    
    // Setup chart animations
    animateChartBars();
    
    // Setup revenue privacy toggle
    setupRevenueToggle();
    
    // Setup check-in modal
    setupCheckInModal();
});

// Animate stat cards
function animateStatCards() {
    const statCards = document.querySelectorAll('.stat-card');
    
    statCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            
            requestAnimationFrame(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            });
        }, index * 100);
    });
}

// Animate chart bars
function animateChartBars() {
    const chartBars = document.querySelectorAll('.chart-bar');
    
    chartBars.forEach((bar, index) => {
        const finalHeight = bar.style.height;
        bar.style.height = '0%';
        
        setTimeout(() => {
            bar.style.transition = 'height 0.8s ease';
            bar.style.height = finalHeight;
        }, index * 80);
    });
}

// Revenue Privacy Toggle
function setupRevenueToggle() {
    const toggleBtn = document.getElementById('revenueToggle');
    if (!toggleBtn) return;
    
    const revenueAmount = document.querySelector('.revenue-amount');
    const revenueMonthly = document.querySelector('.revenue-monthly');
    const eyeIcon = toggleBtn.querySelector('.eye-icon');
    const eyeOffIcon = toggleBtn.querySelector('.eye-off-icon');
    
    // Always start hidden on page load
    let isHidden = true;
    
    // Hide revenue immediately on page load (always default to hidden)
    const todayValue = revenueAmount.dataset.today;
    const monthlyValue = revenueMonthly.dataset.monthly || revenueAmount.dataset.monthly;
    
    const asterisks = '₱' + '*'.repeat(todayValue.length);
    const monthlyAsterisks = '₱' + '*'.repeat(monthlyValue.length);
    
    revenueAmount.textContent = asterisks;
    revenueMonthly.textContent = monthlyAsterisks;
    
    // Show eye-off icon
    eyeIcon.style.display = 'none';
    eyeOffIcon.style.display = 'block';
    
    toggleBtn.addEventListener('click', () => {
        isHidden = !isHidden;
        
        if (isHidden) {
            // Hide revenue - show asterisks
            const todayValue = revenueAmount.dataset.today;
            const monthlyValue = revenueMonthly.dataset.monthly || revenueAmount.dataset.monthly;
            
            const asterisks = '₱' + '*'.repeat(todayValue.length);
            const monthlyAsterisks = '₱' + '*'.repeat(monthlyValue.length);
            
            revenueAmount.textContent = asterisks;
            revenueMonthly.textContent = monthlyAsterisks;
            
            // Swap icons
            eyeIcon.style.display = 'none';
            eyeOffIcon.style.display = 'block';
        } else {
            // Show revenue - restore values
            const todayValue = revenueAmount.dataset.today;
            const monthlyValue = revenueMonthly.dataset.monthly || revenueAmount.dataset.monthly;
            
            revenueAmount.textContent = '₱' + todayValue;
            revenueMonthly.textContent = '₱' + monthlyValue;
            
            // Swap icons
            eyeIcon.style.display = 'block';
            eyeOffIcon.style.display = 'none';
        }
    });
}

// Optional: Auto-refresh dashboard data (if needed)
function refreshDashboardData() {
    // This could be used to fetch updated stats via AJAX
    // For now, we'll just reload the page
    window.location.reload();
}

// Optional: Setup auto-refresh (commented out by default)
// setInterval(refreshDashboardData, 60000); // Refresh every minute

// Check-in Modal Setup
function setupCheckInModal() {
    const modal = document.getElementById('checkInModal');
    const btnCheckIn = document.getElementById('btnCheckIn');
    const closeModal = document.getElementById('closeModal');
    const optionBtns = document.querySelectorAll('.option-btn');
    const memberCheckInForm = document.getElementById('memberCheckInForm');
    const walkInForm = document.getElementById('walkInForm');
    const memberSearch = document.getElementById('memberSearch');
    const memberSearchResults = document.getElementById('memberSearchResults');
    const selectedMemberInfo = document.getElementById('selectedMemberInfo');
    const cancelMemberCheckIn = document.getElementById('cancelMemberCheckIn');
    const cancelWalkIn = document.getElementById('cancelWalkIn');
    
    let searchTimeout = null;
    let selectedMember = null;
    
    // Open modal
    btnCheckIn.addEventListener('click', () => {
        modal.classList.add('active');
        resetModal();
    });
    
    // Close modal
    closeModal.addEventListener('click', () => {
        modal.classList.remove('active');
    });
    
    cancelMemberCheckIn.addEventListener('click', () => {
        modal.classList.remove('active');
    });
    
    cancelWalkIn.addEventListener('click', () => {
        modal.classList.remove('active');
    });
    
    // Click outside modal to close
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
    
    // Switch between member and walk-in
    optionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            optionBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const type = btn.dataset.type;
            if (type === 'member') {
                memberCheckInForm.classList.add('active');
                walkInForm.classList.remove('active');
            } else {
                memberCheckInForm.classList.remove('active');
                walkInForm.classList.add('active');
            }
        });
    });
    
    // Member search
    memberSearch.addEventListener('input', function() {
        const query = this.value.trim();
        
        if (searchTimeout) clearTimeout(searchTimeout);
        
        if (query.length < 2) {
            memberSearchResults.classList.remove('active');
            memberSearchResults.innerHTML = '';
            return;
        }
        
        searchTimeout = setTimeout(() => {
            searchMembers(query);
        }, 300);
    });
    
    function searchMembers(query) {
        fetch(`/dashboard/search-active-members/?q=${encodeURIComponent(query)}`)
            .then(response => response.json())
            .then(data => {
                displayMemberResults(data.members);
            })
            .catch(error => {
                console.error('Error searching members:', error);
            });
    }
    
    function displayMemberResults(members) {
        if (members.length === 0) {
            memberSearchResults.innerHTML = '<div class="search-result-item">No active or expiring members found</div>';
        } else {
            memberSearchResults.innerHTML = members.map(member => `
                <div class="search-result-item" data-member='${JSON.stringify(member)}'>
                    <div class="search-result-name">${member.name}</div>
                    <div class="search-result-id">${member.member_id} - ${member.status}</div>
                </div>
            `).join('');
            
            // Add click handlers
            document.querySelectorAll('.search-result-item').forEach(item => {
                item.addEventListener('click', function() {
                    const member = JSON.parse(this.dataset.member);
                    selectMember(member);
                });
            });
        }
        
        memberSearchResults.classList.add('active');
    }
    
    function selectMember(member) {
        selectedMember = member;
        document.getElementById('selectedMemberId').value = member.member_id;
        memberSearch.value = `${member.member_id} - ${member.name}`;
        memberSearchResults.classList.remove('active');
        
        // Show member info
        const initials = member.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
        document.getElementById('memberCardAvatar').textContent = initials;
        document.getElementById('memberCardName').textContent = member.name;
        document.getElementById('memberCardId').textContent = member.member_id;
        
        const statusBadge = document.getElementById('memberCardStatus');
        statusBadge.textContent = member.status === 'active' ? 'Active' : 'Expiring Soon';
        statusBadge.className = 'member-card-status ' + member.status;
        
        selectedMemberInfo.style.display = 'block';
    }
    
    // Member check-in submission
    memberCheckInForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!selectedMember) {
            alert('Please select a member');
            return;
        }
        
        const submitBtn = document.getElementById('submitMemberCheckIn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Logging...';
        
        fetch('/dashboard/log-checkin/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCsrfToken()
            },
            body: JSON.stringify({
                member_id: selectedMember.member_id
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Check-in logged successfully!');
                modal.classList.remove('active');
                window.location.reload();
            } else {
                alert('Error: ' + data.error);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while logging check-in');
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Log Check-in';
        });
    });
    
    // Walk-in submission
    walkInForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const guestName = document.getElementById('guestName').value.trim();
        const guestGender = document.getElementById('guestGender').value;
        
        if (!guestName || !guestGender) {
            alert('Please fill in all fields');
            return;
        }
        
        // Store walk-in data in sessionStorage and redirect to payments
        sessionStorage.setItem('walkInGuest', JSON.stringify({
            name: guestName,
            gender: guestGender
        }));
        
        window.location.href = '/payments/?walkin=true';
    });
    
    function resetModal() {
        memberSearch.value = '';
        memberSearchResults.innerHTML = '';
        memberSearchResults.classList.remove('active');
        selectedMemberInfo.style.display = 'none';
        selectedMember = null;
        document.getElementById('guestName').value = 'Guest';
        document.getElementById('guestGender').value = '';
        
        // Reset to member check-in
        optionBtns[0].click();
    }
    
    function getCsrfToken() {
        return document.querySelector('[name=csrfmiddlewaretoken]')?.value || 
               document.cookie.match(/csrftoken=([^;]+)/)?.[1];
    }
}
