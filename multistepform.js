document.addEventListener('alpine:init', () => {
    Alpine.data('multiStepForm', () => ({
        currentStep: 'slide-1',  // Startet auf dem ersten Slide
        totalSteps: 0,  // Gesamtzahl der Schritte (je nach Anzahl deiner Slides)
        history: [],  // Speichert die Historie der besuchten Slides
        formData: {
            category: '',  // Speichert die Kategorie-Auswahl
            productType: '',  // Speichert den Produkttyp
        },
        
         // Berechnet die Breite der Progressbar basierend auf dem aktuellen Schritt
         get progressWidth() {
            const stepIndex = this.getStepIndex(this.currentStep);

            // Debugging: Logge den aktuellen Schritt und den berechneten Step-Index
            console.log('Aktueller Schritt:', this.currentStep);
            console.log('Step-Index für ' + this.currentStep + ':', stepIndex);
            console.log('Gesamtzahl der Schritte:', this.totalSteps);
            
            // Berechne den Fortschritt in Prozent
            const progress = (stepIndex / this.totalSteps) * 100 + '%';
            console.log('Berechneter Fortschritt:', progress);  // Logge den Fortschritt
            return progress;
        },

        // Initialisiert die Gesamtanzahl der Schritte
        initializeSteps() {
            this.totalSteps = this.getStepIndex('slide-4-upload') + 1;  // Gesamtanzahl der Schritte, basierend auf dem letzten Schritt
            console.log('Gesamtzahl der Schritte gesetzt auf:', this.totalSteps);  // Logge die Gesamtanzahl der Schritte
        },

        // Berechnet den Index des aktuellen Schrittes
        getStepIndex(step) {
            const steps = [
                'slide-1',               // Startschritt
                'slide-2-grafik', 'slide-3-print', 'slide-4-upload',  // Grafikdesign-Route
                'slide-2-grafik', 'slide-3-digital', 'slide-4-upload', // Grafikdesign-Route für Digitalprodukte
                'slide-2-video', 'slide-4-upload', // Video-Route
                'slide-2-web', 'slide-3-leistungsangebot', 'slide-4-upload', // Webdesign-Route Landingpage und Co.
                'slide-2-web', 'slide-3-calender', // Webdesign-Route Aufwendige Projekte
                'slide-2-3d', 'slide-3-calender', // 3D-Design-Route
                'slide-2-sonstiges', 'slide-3-calender' // Sonstige Route
            ];
            const index = steps.indexOf(step);

            // Debugging: Logge den Schritt und den berechneten Index
            console.log('Berechneter Index für Schritt', step, ':', index);
            return index;
        },
        
        // Navigiert zum nächsten Slide basierend auf der Kategorie- und Produkttyp-Auswahl
        navigateToNextSlide() {
            const category = this.formData.category;
            const productType = this.formData.productType;

            // Debugging: Logge die Auswahl der Kategorie und den Produkttyp
            console.log('Kategorie ausgewählt:', category);
            console.log('Produkttyp ausgewählt:', productType);

            // Füge den aktuellen Schritt zur Historie hinzu, bevor der nächste Schritt geladen wird
            this.history.push(this.currentStep);

            // Überprüfe die Auswahl der Kategorie und leite zu der entsprechenden Slide weiter
            if (this.currentStep === 'slide-1') {
                // Falls der User auf der ersten Slide ist, prüfen wir die Kategorie
                if (category === "Grafikdesign") {
                    this.currentStep = 'slide-2-grafik';
                } else if (category === "Videoschnitt / Motiondesign") {
                    this.currentStep = 'slide-2-video';
                } else if (category === "Webdesign / Entwicklung") {
                    this.currentStep = 'slide-2-web';
                } else if (category === "3D Design") {
                    this.currentStep = 'slide-2-3d';
                } else if (category === "Sonstige") {
                    this.currentStep = 'slide-2-sonstiges';
                }
            } else if (this.currentStep === 'slide-2-grafik') {
                // Falls der User auf der slide-2-grafik ist, überprüfen wir den Produkttyp
                if (productType === "Printprodukt") {
                    this.currentStep = 'slide-3-print';
                } else if (productType === "Digitalprodukt") {
                    this.currentStep = 'slide-3-digital';
                }
            } else if (this.currentStep === 'slide-3-print' || this.currentStep === 'slide-3-digital') {
                // Weiterleitung nach Auswahl der Produkte auf slide-4-upload
                this.currentStep = 'slide-4-upload';
            } else if (this.currentStep === 'slide-2-video') {
                // Für Video-Auswahl geht es direkt zu slide-4-upload
                this.currentStep = 'slide-4-upload';
            } else if (this.currentStep === 'slide-2-web') {
                // Auf der Slide 'slide-2-web' überprüfen wir den Produkttyp
                console.log('Produkttyp auf slide-2-web:', this.formData.productType);
                if (
                    productType === "Landingpage" ||
                    productType === "Blog" ||
                    productType === "Portfolio"
                ) {
                    this.currentStep = 'slide-3-leistungsangebot'; // Weiterleitung nach Auswahl
                } else if (
                    productType === "Corporate Website" ||
                    productType === "E-Commerce" ||
                    productType === "WebApp" ||
                    productType === "Plattform" ||
                    productType === "Etwas anderes"
                ) {
                    this.currentStep = 'slide-3-calender'; // Weiterleitung zu Kalender-Slide
                }
            } else if (this.currentStep === 'slide-3-leistungsangebot') {
                // Weiterleitung nach Leistungsangebot zu 'slide-4-upload'
                this.currentStep = 'slide-4-upload';
            } else if (this.currentStep === 'slide-3-calender') {
                // Weiterleitung nach Kalender zu 'slide-4-upload'
                this.currentStep = 'slide-4-upload';
            }
        },

        // Zurück zur vorherigen Seite
        navigateToPreviousSlide() {
            if (this.history.length > 0) {
                this.currentStep = this.history.pop();
            }
        },

        // Sichtbarkeit der Buttons
        showBackButton() {
            return this.currentStep !== 'slide-1'; // Verhindert, dass der Zurück-Button auf der ersten Seite sichtbar ist
        },

        showNextButton() {
            return this.currentStep !== 'slide-4-upload'; // Weiter-Button nur auf den passenden Seiten sichtbar
        },

        showSubmitButton() {
            return this.currentStep === 'slide-4-upload'; // Submit-Button nur auf der letzten Seite sichtbar
        }
    }));
});
