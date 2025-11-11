// Walk-in Guest Handler - Add to payments.js
// This script handles walk-in guest initialization on payment page

document.addEventListener('DOMContentLoaded', function() {
    // Check for walk-in guest from sessionStorage
    const walkInData = sessionStorage.getItem('walkInGuest');
    if (walkInData) {
        const guest = JSON.parse(walkInData);
        sessionStorage.removeItem('walkInGuest');
        
        // Get elements
        const memberSearchInput = document.getElementById('member_search');
        const memberIdHidden = document.getElementById('member_id');
        
        if (memberSearchInput && memberIdHidden) {
            // Set up walk-in guest
            memberSearchInput.value = 'GYMMSGUEST';
            memberIdHidden.value = 'GYMMSGUEST';
            
            // Trigger member info display for guest
            const guestMember = {
                member_id: 'GYMMSGUEST',
                name: guest.name,
                phone_number: 'Walk-in Guest',
                end_date: 'N/A',
                photo: null,
                status: 'guest',
                gender: guest.gender
            };
            
            // Update member info card
            updateGuestMemberCard(guestMember);
            
            // Auto-select Walk-In pricing
            setTimeout(() => {
                selectWalkInPricing();
            }, 100);
        }
    }
});

function updateGuestMemberCard(member) {
    // Update display fields
    const nameField = document.getElementById('display_member_name');
    const idField = document.getElementById('display_member_id');
    const phoneField = document.getElementById('display_member_phone');
    const endDateField = document.getElementById('display_member_end_date');
    const statusField = document.getElementById('display_member_status');
    const avatarContainer = document.getElementById('memberAvatarContainer');
    
    if (idField) idField.textContent = member.member_id;
    if (phoneField) phoneField.textContent = member.phone_number;
    if (endDateField) endDateField.textContent = member.end_date;
    
    // Display name (not editable since it was already entered in the modal)
    if (nameField) {
        nameField.textContent = member.name;
    }
    
    // Update avatar - use default green gradient like regular members
    if (avatarContainer) {
        const initials = member.name.substring(0, 2).toUpperCase();
        avatarContainer.innerHTML = `<div class="member-initials">${initials}</div>`;
    }
    
    // Update expiry date to "Today"
    if (endDateField) {
        endDateField.textContent = 'Today';
    }
    
    // Update status
    if (statusField) {
        statusField.innerHTML = '<span class="status-badge" style="background: rgba(59, 130, 246, 0.1); color: #3b82f6;">Walk-in Guest</span>';
    }
}

function selectWalkInPricing() {
    const pricingSelect = document.getElementById('pricing_id');
    if (pricingSelect) {
        // Look for "Walk-In" or "Daily Walk-in" option
        for (let option of pricingSelect.options) {
            if (option.text.toLowerCase().includes('walk-in') || 
                option.text.toLowerCase().includes('walk in') ||
                option.text.toLowerCase().includes('daily')) {
                option.selected = true;
                break;
            }
        }
        
        // Make the select field disabled/readonly
        pricingSelect.disabled = true;
        pricingSelect.style.opacity = '0.7';
        pricingSelect.style.cursor = 'not-allowed';
        pricingSelect.style.background = '#f3f4f6';
        
        // Add a hidden input to ensure the value is still submitted
        const hiddenInput = document.createElement('input');
        hiddenInput.type = 'hidden';
        hiddenInput.name = 'pricing_id';
        hiddenInput.value = pricingSelect.value;
        hiddenInput.id = 'pricing_id_hidden';
        pricingSelect.parentNode.appendChild(hiddenInput);
        
        // Update hidden input if user somehow changes the select
        pricingSelect.addEventListener('change', function() {
            const hidden = document.getElementById('pricing_id_hidden');
            if (hidden) {
                hidden.value = this.value;
            }
        });
    }
}
