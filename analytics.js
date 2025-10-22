// Sistema de Analíticas Simple
class AnalyticsSystem {
    constructor() {
        this.trackPageVisit();
    }

    trackPageVisit() {
        // Obtener contador de visitas
        let analytics = this.getAnalytics();
        
        // Incrementar visitas totales
        analytics.totalVisits = (analytics.totalVisits || 0) + 1;
        
        // Registrar visita con timestamp
        if (!analytics.visits) {
            analytics.visits = [];
        }
        
        analytics.visits.push({
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            language: navigator.language,
            screenSize: `${window.screen.width}x${window.screen.height}`
        });
        
        // Limitar el array a las últimas 1000 visitas para no saturar localStorage
        if (analytics.visits.length > 1000) {
            analytics.visits = analytics.visits.slice(-1000);
        }
        
        // Guardar
        this.saveAnalytics(analytics);
    }

    getAnalytics() {
        const data = localStorage.getItem('siteAnalytics');
        return data ? JSON.parse(data) : {
            totalVisits: 0,
            visits: [],
            firstVisit: new Date().toISOString()
        };
    }

    saveAnalytics(analytics) {
        localStorage.setItem('siteAnalytics', JSON.stringify(analytics));
    }

    getTotalVisits() {
        return this.getAnalytics().totalVisits || 0;
    }

    getVisitsToday() {
        const analytics = this.getAnalytics();
        const today = new Date().toDateString();
        
        return analytics.visits.filter(visit => {
            const visitDate = new Date(visit.timestamp).toDateString();
            return visitDate === today;
        }).length;
    }

    getVisitsThisWeek() {
        const analytics = this.getAnalytics();
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        
        return analytics.visits.filter(visit => {
            const visitDate = new Date(visit.timestamp);
            return visitDate >= weekAgo;
        }).length;
    }

    getVisitsThisMonth() {
        const analytics = this.getAnalytics();
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        
        return analytics.visits.filter(visit => {
            const visitDate = new Date(visit.timestamp);
            return visitDate >= monthAgo;
        }).length;
    }

    clearAnalytics() {
        if (confirm('⚠️ ¿Estás seguro de limpiar todas las estadísticas de visitas?')) {
            localStorage.removeItem('siteAnalytics');
            return true;
        }
        return false;
    }

    exportAnalytics() {
        const analytics = this.getAnalytics();
        const dataStr = JSON.stringify(analytics, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `analytics-${Date.now()}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
    }
}

// Inicializar sistema de analíticas automáticamente
const analyticsSystem = new AnalyticsSystem();

// Exponer globalmente para el panel de admin
window.analyticsSystem = analyticsSystem;
