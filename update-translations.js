// Script to update hardcoded text to use translations
// This file will help identify patterns and guide manual updates

const fs = require('fs');
const path = require('path');

const componentUpdates = [
  // UserSettings.jsx translations
  {
    file: 'src/Pages/UserSettings/UserSettings.jsx',
    replacements: [
      { from: '"Change Photo"', to: '{t("userSettings.changePhoto")}' },
      { from: '"First Name"', to: '{t("userSettings.firstName")}' },
      { from: '"Last Name"', to: '{t("userSettings.lastName")}' },
      { from: '"Email Address"', to: '{t("userSettings.emailAddress")}' },
      { from: '"Phone Number"', to: '{t("userSettings.phoneNumber")}' },
      { from: '"Department"', to: '{t("userSettings.department")}' },
      { from: '"Location"', to: '{t("userSettings.location")}' },
      { from: '"Bio"', to: '{t("userSettings.bio")}' },
      { from: '"Tell us about yourself..."', to: '{t("userSettings.bioPlaceholder")}' },
      { from: '"Appearance"', to: '{t("userSettings.appearance")}' },
      { from: '"Dark Mode"', to: '{t("userSettings.darkMode")}' },
      { from: '"Toggle dark/light theme"', to: '{t("userSettings.darkModeDescription")}' },
      { from: '"Compact Mode"', to: '{t("userSettings.compactMode")}' },
      { from: '"Reduce spacing and padding"', to: '{t("userSettings.compactModeDescription")}' },
      { from: '"Page Transitions"', to: '{t("userSettings.pageTransitions")}' },
      { from: '"Choose how pages transition"', to: '{t("userSettings.pageTransitionsDescription")}' },
      { from: '"Fade & Scale"', to: '{t("userSettings.fadeScale")}' },
      { from: '"Slide 3D"', to: '{t("userSettings.slide3D")}' },
      { from: '"Liquid Morph"', to: '{t("userSettings.liquidMorph")}' },
      { from: '"Curtain Reveal"', to: '{t("userSettings.curtainReveal")}' },
      { from: '"Glitch Effect"', to: '{t("userSettings.glitchEffect")}' }
    ]
  },
  
  // Filters.jsx translations
  {
    file: 'src/Pages/PartsManager/Filters.jsx',
    replacements: [
      { from: '"Part Number"', to: '{t("filters.partNumber")}' },
      { from: '"Enter part number"', to: '{t("filters.partNumber")}' },
      { from: '"Location"', to: '{t("filters.location")}' },
      { from: '"All Locations"', to: '{t("filters.allLocations")}' },
      { from: '"Category"', to: '{t("filters.category")}' },
      { from: '"All Categories"', to: '{t("filters.allCategories")}' },
      { from: '"Status"', to: '{t("filters.status")}' },
      { from: '"All Status"', to: '{t("filters.allStatus")}' },
      { from: '"Apply Filters"', to: '{t("filters.applyFilters")}' },
      { from: '"Applying..."', to: '{t("filters.applying")}' },
      { from: '"Reset"', to: '{t("filters.resetFilters")}' },
      { from: '"Active filters:"', to: '{t("filters.activeFilters")}' },
      { from: '"Export Data"', to: '{t("filters.exportData")}' },
      { from: '"Download Template"', to: '{t("filters.downloadTemplate")}' },
      { from: '"Discontinued"', to: '{t("filters.discontinued")}' }
    ]
  },

  // FoundItem.jsx translations
  {
    file: 'src/Pages/PartsManager/PartsPortalTabs/FoundItem.jsx',
    replacements: [
      { from: '"Item Found"', to: '{t("partsManager.itemFound")}' },
      { from: '"Part details ready for editing"', to: '{t("partsManager.itemFoundDescription")}' },
      { from: '"Part No"', to: '{t("partsManager.partNo")}' },
      { from: '"Description"', to: '{t("partsManager.description")}' },
      { from: '"Price"', to: '{t("partsManager.price")}' },
      { from: '"MLFB"', to: '{t("partsManager.mlfb")}' },
      { from: '"Category"', to: '{t("partsManager.category")}' },
      { from: '"Action"', to: '{t("partsManager.action")}' },
      { from: '"Edit Item"', to: '{t("partsManager.editItem")}' },
      { from: '"Edit Item Details"', to: '{t("partsManager.editItemDetails")}' },
      { from: '"Save Changes"', to: '{t("partsManager.saveChanges")}' },
      { from: '"Saving..."', to: '{t("partsManager.saving")}' },
      { from: '"Cancel"', to: '{t("common.cancel")}' },
      { from: '"Upload Image"', to: '{t("partsManager.uploadImage")}' },
      { from: '"JPG, PNG or GIF (max 2MB)"', to: '{t("partsManager.imageUploadHint")}' }
    ]
  }
];

console.log('Manual translation updates needed:');
console.log('===================================');

componentUpdates.forEach(component => {
  console.log(`\nFile: ${component.file}`);
  console.log('Replacements needed:');
  component.replacements.forEach(replacement => {
    console.log(`  ${replacement.from} -> ${replacement.to}`);
  });
});

console.log('\n\nNext steps:');
console.log('1. Add useTranslation hook to each component');
console.log('2. Apply the replacements manually');
console.log('3. Test the translations in different languages');
console.log('4. Create translation files for de, ar, ms languages');