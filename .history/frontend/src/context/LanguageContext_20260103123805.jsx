import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Translation dictionary
const translations = {
  en: {
    // Header
    home: 'Home',
    myTrips: 'My Trips',
    explore: 'Explore',
    
    // Dashboard
    planNextAdventure: 'Plan Your Next',
    adventure: 'Adventure',
    discoverDestinations: 'Discover amazing destinations, create personalized itineraries, and make your travel dreams come true.',
    startPlanning: 'Start Planning',
    topRegionalSelections: 'Top Regional Selections',
    viewAll: 'View all',
    previousTrips: 'Previous Trips',
    planATrip: 'Plan a trip',
    
    // Profile
    editProfile: 'Edit Profile',
    save: 'Save',
    savedDestinations: 'Saved Destinations',
    settingsPrivacy: 'Settings & Privacy',
    preplannedTrips: 'Preplanned Trips',
    languagePreference: 'Language Preference',
    languageDescription: 'Choose your preferred language for the application',
    current: 'Current',
    privacySettings: 'Privacy Settings',
    makeProfilePublic: 'Make profile public',
    allowOthersSee: 'Allow others to see your profile and trips',
    emailNotifications: 'Email notifications',
    receiveUpdates: 'Receive updates about your trips',
    shareTripData: 'Share trip data',
    helpImprove: 'Help improve recommendations',
    deleteAccount: 'Delete Account',
    deleteWarning: 'Once you delete your account, there is no going back. Please be certain.',
    deleteMyAccount: 'Delete My Account',
    cancel: 'Cancel',
    yesDelete: 'Yes, Delete',
    deleteConfirmation: 'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.',
    destinations: 'destinations',
    planTrip: 'Plan Trip',
    view: 'View',
    saved: 'Saved',
    
    // Notifications
    languageChanged: 'Language changed to',
    languageApplied: 'This will be applied across the app.',
    profileUpdated: 'Profile updated successfully!',
  },
  es: {
    // Header
    home: 'Inicio',
    myTrips: 'Mis Viajes',
    explore: 'Explorar',
    
    // Dashboard
    planNextAdventure: 'Planifica Tu Próxima',
    adventure: 'Aventura',
    discoverDestinations: 'Descubre destinos increíbles, crea itinerarios personalizados y haz realidad tus sueños de viaje.',
    startPlanning: 'Comenzar a Planificar',
    topRegionalSelections: 'Mejores Selecciones Regionales',
    viewAll: 'Ver todo',
    previousTrips: 'Viajes Anteriores',
    planATrip: 'Planificar un viaje',
    
    // Profile
    editProfile: 'Editar Perfil',
    save: 'Guardar',
    savedDestinations: 'Destinos Guardados',
    settingsPrivacy: 'Configuración y Privacidad',
    preplannedTrips: 'Viajes Planificados',
    languagePreference: 'Preferencia de Idioma',
    languageDescription: 'Elige tu idioma preferido para la aplicación',
    current: 'Actual',
    privacySettings: 'Configuración de Privacidad',
    makeProfilePublic: 'Hacer perfil público',
    allowOthersSee: 'Permitir que otros vean tu perfil y viajes',
    emailNotifications: 'Notificaciones por correo',
    receiveUpdates: 'Recibir actualizaciones sobre tus viajes',
    shareTripData: 'Compartir datos de viaje',
    helpImprove: 'Ayudar a mejorar las recomendaciones',
    deleteAccount: 'Eliminar Cuenta',
    deleteWarning: 'Una vez que elimines tu cuenta, no hay vuelta atrás. Por favor, ten certeza.',
    deleteMyAccount: 'Eliminar Mi Cuenta',
    cancel: 'Cancelar',
    yesDelete: 'Sí, Eliminar',
    deleteConfirmation: '¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer y todos tus datos se eliminarán permanentemente.',
    destinations: 'destinos',
    planTrip: 'Planificar Viaje',
    view: 'Ver',
    saved: 'Guardado',
    
    // Notifications
    languageChanged: 'Idioma cambiado a',
    languageApplied: 'Esto se aplicará en toda la aplicación.',
    profileUpdated: '¡Perfil actualizado con éxito!',
  },
  fr: {
    // Header
    home: 'Accueil',
    myTrips: 'Mes Voyages',
    explore: 'Explorer',
    
    // Dashboard
    planNextAdventure: 'Planifiez Votre Prochaine',
    adventure: 'Aventure',
    discoverDestinations: 'Découvrez des destinations incroyables, créez des itinéraires personnalisés et réalisez vos rêves de voyage.',
    startPlanning: 'Commencer à Planifier',
    topRegionalSelections: 'Meilleures Sélections Régionales',
    viewAll: 'Voir tout',
    previousTrips: 'Voyages Précédents',
    planATrip: 'Planifier un voyage',
    
    // Profile
    editProfile: 'Modifier le Profil',
    save: 'Enregistrer',
    savedDestinations: 'Destinations Enregistrées',
    settingsPrivacy: 'Paramètres et Confidentialité',
    preplannedTrips: 'Voyages Planifiés',
    languagePreference: 'Préférence de Langue',
    languageDescription: 'Choisissez votre langue préférée pour l\'application',
    current: 'Actuel',
    privacySettings: 'Paramètres de Confidentialité',
    makeProfilePublic: 'Rendre le profil public',
    allowOthersSee: 'Permettre aux autres de voir votre profil et vos voyages',
    emailNotifications: 'Notifications par e-mail',
    receiveUpdates: 'Recevoir des mises à jour sur vos voyages',
    shareTripData: 'Partager les données de voyage',
    helpImprove: 'Aider à améliorer les recommandations',
    deleteAccount: 'Supprimer le Compte',
    deleteWarning: 'Une fois votre compte supprimé, il n\'y a pas de retour en arrière. Soyez certain.',
    deleteMyAccount: 'Supprimer Mon Compte',
    cancel: 'Annuler',
    yesDelete: 'Oui, Supprimer',
    deleteConfirmation: 'Êtes-vous sûr de vouloir supprimer votre compte? Cette action ne peut pas être annulée et toutes vos données seront définitivement supprimées.',
    destinations: 'destinations',
    planTrip: 'Planifier un Voyage',
    view: 'Voir',
    saved: 'Enregistré',
    
    // Notifications
    languageChanged: 'Langue changée en',
    languageApplied: 'Cela sera appliqué dans toute l\'application.',
    profileUpdated: 'Profil mis à jour avec succès!',
  },
  de: {
    // Header
    home: 'Startseite',
    myTrips: 'Meine Reisen',
    explore: 'Erkunden',
    
    // Dashboard
    planNextAdventure: 'Planen Sie Ihr Nächstes',
    adventure: 'Abenteuer',
    discoverDestinations: 'Entdecken Sie erstaunliche Reiseziele, erstellen Sie personalisierte Reiserouten und verwirklichen Sie Ihre Reiseträume.',
    startPlanning: 'Planung Beginnen',
    topRegionalSelections: 'Top Regionale Auswahl',
    viewAll: 'Alle anzeigen',
    previousTrips: 'Frühere Reisen',
    planATrip: 'Eine Reise planen',
    
    // Profile
    editProfile: 'Profil Bearbeiten',
    save: 'Speichern',
    savedDestinations: 'Gespeicherte Ziele',
    settingsPrivacy: 'Einstellungen & Datenschutz',
    preplannedTrips: 'Geplante Reisen',
    languagePreference: 'Spracheinstellung',
    languageDescription: 'Wählen Sie Ihre bevorzugte Sprache für die Anwendung',
    current: 'Aktuell',
    privacySettings: 'Datenschutzeinstellungen',
    makeProfilePublic: 'Profil öffentlich machen',
    allowOthersSee: 'Anderen erlauben, Ihr Profil und Ihre Reisen zu sehen',
    emailNotifications: 'E-Mail-Benachrichtigungen',
    receiveUpdates: 'Updates über Ihre Reisen erhalten',
    shareTripData: 'Reisedaten teilen',
    helpImprove: 'Helfen Sie, Empfehlungen zu verbessern',
    deleteAccount: 'Konto Löschen',
    deleteWarning: 'Sobald Sie Ihr Konto löschen, gibt es kein Zurück mehr. Bitte seien Sie sicher.',
    deleteMyAccount: 'Mein Konto Löschen',
    cancel: 'Abbrechen',
    yesDelete: 'Ja, Löschen',
    deleteConfirmation: 'Sind Sie sicher, dass Sie Ihr Konto löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden und alle Ihre Daten werden dauerhaft entfernt.',
    destinations: 'Ziele',
    planTrip: 'Reise Planen',
    view: 'Ansicht',
    saved: 'Gespeichert',
    
    // Notifications
    languageChanged: 'Sprache geändert zu',
    languageApplied: 'Dies wird in der gesamten App angewendet.',
    profileUpdated: 'Profil erfolgreich aktualisiert!',
  },
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Load from localStorage on init
    const saved = localStorage.getItem('globetrotter_language');
    return saved || 'en';
  });

  // Save to localStorage whenever language changes
  useEffect(() => {
    localStorage.setItem('globetrotter_language', language);
  }, [language]);

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
  };

  const t = (key) => {
    return translations[language]?.[key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
