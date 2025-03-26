document.addEventListener('DOMContentLoaded', function() {
  // Function to update package prices based on guest count
  window.updatePackagePrices = function(guestCount) {
    if (!guestCount || isNaN(parseInt(guestCount))) {
      guestCount = 1; // Default to 1 guest if not specified
    } else {
      guestCount = parseInt(guestCount);
    }
    
    // Get all package elements
    var packages = document.querySelectorAll('.el');
    
    packages.forEach(function(packageEl) {
      // Get the price element
      var priceElement = packageEl.querySelector('.package-price');
      if (!priceElement) return;
      
      // Get the original price if stored, otherwise parse from current text
      var originalPrice = packageEl.getAttribute('data-original-price');
      if (!originalPrice) {
        // Extract the price from the text (assuming format like "$1,200 MXN")
        var priceText = priceElement.textContent;
        originalPrice = parseInt(priceText.replace(/[^0-9]/g, ''));
        
        // Store the original price as an attribute for future reference
        packageEl.setAttribute('data-original-price', originalPrice);
      } else {
        originalPrice = parseInt(originalPrice);
      }
      
      // Calculate the total price based on guest count
      var totalPrice = originalPrice * guestCount;
      
      // Update the price display
      if (guestCount > 1) {
        priceElement.innerHTML = `$${totalPrice.toLocaleString()} MXN <small>(${guestCount} personas)</small>`;
      } else {
        priceElement.textContent = `$${originalPrice.toLocaleString()} MXN`;
      }
    });
  };
  
  // Listen for changes to guest count inputs
  document.querySelectorAll('[id^="guests-count"]').forEach(function(input) {
    input.addEventListener('change', function() {
      window.updatePackagePrices(this.value);
    });
  });
  
  // Initialize with default guest count
  var defaultGuestCount = document.querySelector('[id^="guests-count"]')?.value || 1;
  window.updatePackagePrices(defaultGuestCount);
});