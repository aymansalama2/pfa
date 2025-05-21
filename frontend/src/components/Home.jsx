import React, { useEffect } from 'react';
import '../App.css'; // Assurez-vous d'importer votre fichier CSS
import AOS from 'aos';
import 'aos/dist/aos.css'; // Importation des styles AOS

function App() {
    useEffect(() => {
        AOS.init({
            duration: 1000,
            easing: 'ease-out-cubic',
            once: true
        });
    }, []);

    return (
        <div className="min-h-screen bg-dark-900">
            {/* Navigation */}
            <nav className="fixed w-full z-50 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <span className="text-3xl font-display font-bold">
                                    <span className="text-brand-500">S</span>
                                    <span className="text-gray-400">R</span>
                                    <span className="text-brand-500">M</span>
                                </span>
                            </div>
                            <div className="hidden md:flex ml-10 space-x-8">
                                <a href="#accueil" className="text-gray-300 hover:text-brand-500 transition-colors duration-300">
                                    Accueil
                                </a>
                                <a href="#services" className="text-gray-300 hover:text-brand-500 transition-colors duration-300">
                                    Services
                                </a>
                                <a href="#apropos" className="text-gray-300 hover:text-brand-500 transition-colors duration-300">
                                    À propos
                                </a>
                                <a href="#contact" className="text-gray-300 hover:text-brand-500 transition-colors duration-300">
                                    Contact
                                </a>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <a href="/signin" className="btn-secondary">
                                Se connecter
                            </a>
                            <a href="/signup" className="btn-primary">
                                Commencer
                            </a>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section id="accueil" className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-dark-900 via-brand-900/20 to-dark-900"></div>
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-500/20 rounded-full filter blur-[100px]"></div>
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-500/20 rounded-full filter blur-[100px]"></div>
                </div>

                {/* Hero Section - Suite */}
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8" data-aos="fade-right">
                            <h1 className="text-5xl md:text-6xl font-display font-bold text-white leading-tight">
                                Révolutionnez votre
                                <span className="bg-gradient-to-r from-brand-500 to-accent-500 bg-clip-text text-transparent"> Recouvrement</span>
                            </h1>
                            <p className="text-xl text-gray-300">
                                Une solution innovante qui transforme la gestion de vos créances avec intelligence et efficacité.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <a href="#contact" className="btn-primary">
                                    Démarrer maintenant
                                </a>
                                <a href="#services" className="btn-secondary">
                                    Découvrir nos services
                                </a>
                            </div>
                            <div className="grid grid-cols-3 gap-4 pt-8">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-brand-500">98%</div>
                                    <div className="text-sm text-gray-400">Taux de réussite</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-brand-500">24/7</div>
                                    <div className="text-sm text-gray-400">Support client</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-brand-500">+500</div>
                                    <div className="text-sm text-gray-400">Clients satisfaits</div>
                                </div>
                            </div>
                        </div>
                        <div className="relative" data-aos="fade-left">
                            <div className="relative rounded-2xl overflow-hidden bg-dark-800/50 border border-dark-700/50 h-[600px]">
                                <div className="absolute inset-0 bg-gradient-to-tr from-brand-500/10 to-accent-500/10"></div>
                                
                                {/* Éléments flottants */}
                                <div className="absolute top-8 left-8 card p-4 float-animation" style={{animationDelay: '0s'}}>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-brand-500/20 flex items-center justify-center">
                                            <i className="fas fa-chart-line text-brand-500"></i>
                                        </div>
                                        <div>
                                            <div className="text-sm font-semibold text-white">Taux de réussite</div>
                                            <div className="text-lg font-bold text-brand-500">+45%</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="absolute top-8 right-8 card p-4 float-animation" style={{animationDelay: '0.2s'}}>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-accent-500/20 flex items-center justify-center">
                                            <i className="fas fa-users text-accent-500"></i>
                                        </div>
                                        <div>
                                            <div className="text-sm font-semibold text-white">Clients actifs</div>
                                            <div className="text-lg font-bold text-accent-500">2,543</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Graphique central */}
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64">
                                    <div className="relative w-full h-full">
                                        <div className="absolute inset-0 bg-brand-500/10 rounded-full animate-pulse"></div>
                                        <div className="absolute inset-4 bg-brand-500/20 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                                        <div className="absolute inset-8 bg-brand-500/30 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="text-center">
                                                <i className="fas fa-robot text-5xl text-brand-500 mb-4"></i>
                                                <div className="text-xl font-semibold text-white">IA Prédictive</div>
                                                <div className="text-sm text-gray-400">Analyse en temps réel</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Éléments flottants bas */}
                                <div className="absolute bottom-8 left-8 card p-4 float-animation" style={{animationDelay: '0.4s'}}>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                                            <i className="fas fa-check-circle text-green-500"></i>
                                        </div>
                                        <div>
                                            <div className="text-sm font-semibold text-white">Dossiers traités</div>
                                            <div className="text-lg font-bold text-green-500">12,789</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="absolute bottom-8 right-8 card p-4 float-animation" style={{animationDelay: '0.6s'}}>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                                            <i className="fas fa-bolt text-purple-500"></i>
                                        </div>
                                        <div>
                                            <div className="text-sm font-semibold text-white">Temps moyen</div>
                                            <div className="text-lg font-bold text-purple-500">-35%</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Lignes de connexion */}
                                <div className="absolute inset-0">
                                    <svg className="absolute inset-0 w-full h-full" style={{opacity: 0.1}}>
                                        <line x1="20%" y1="20%" x2="50%" y2="50%" stroke="url(#gradient)" strokeWidth="2" />
                                        <line x1="80%" y1="20%" x2="50%" y2="50%" stroke="url(#gradient)" strokeWidth="2" />
                                        <line x1="20%" y1="80%" x2="50%" y2="50%" stroke="url(#gradient)" strokeWidth="2" />
                                        <line x1="80%" y1="80%" x2="50%" y2="50%" stroke="url(#gradient)" strokeWidth="2" />
                                        <defs>
                                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="0%" stopColor="#ef4444" />
                                                <stop offset="100%" stopColor="#f97316" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                </div>

                                {/* Particules d'arrière-plan */}
                                <div className="absolute inset-0 overflow-hidden">
                                    {[...Array(20)].map((_, i) => (
                                        <div
                                            key={i}
                                            className="absolute w-2 h-2 bg-brand-500/20 rounded-full"
                                            style={{
                                                top: `${Math.random() * 100}%`,
                                                left: `${Math.random() * 100}%`,
                                                animation: `float ${5 + Math.random() * 5}s infinite`,
                                                animationDelay: `${Math.random() * 5}s`
                                            }}
                                        ></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section id="services" className="py-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-dark-800"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16" data-aos="fade-up">
                        <span className="inline-block px-4 py-1 rounded-full text-brand-500 bg-brand-500/10 font-medium mb-4">
                            Nos Services
                        </span>
                        <h2 className="section-title">Solutions Complètes de Recouvrement</h2>
                        <p className="section-subtitle">
                            Des solutions adaptées à vos besoins spécifiques
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Service Card 1 */}
                        <div className="card p-8 hover-card" data-aos="fade-up" data-aos-delay="100">
                            <div className="text-brand-500 text-4xl mb-4">
                                <i className="fas fa-chart-line"></i>
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-4">
                                Recouvrement Amiable
                            </h3>
                            <p className="text-gray-400 mb-6">
                                Approche professionnelle et efficace pour résoudre les impayés à l'amiable.
                            </p>
                            <a href="#contact" className="text-brand-500 font-medium hover:text-brand-400 transition-colors">
                                En savoir plus →
                            </a>
                        </div>

                        {/* Service Card 2 */}
                        <div className="card p-8 hover-card" data-aos="fade-up" data-aos-delay="200">
                            <div className="text-brand-500 text-4xl mb-4">
                                <i className="fas fa-balance-scale"></i>
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-4">
                                Recouvrement Judiciaire
                            </h3>
                            <p className="text-gray-400 mb-6">
                                Expertise juridique pour le recouvrement de vos créances complexes.
                            </p>
                            <a href="#contact" className="text-brand-500 font-medium hover:text-brand-400 transition-colors">
                                En savoir plus →
                            </a>
                        </div>

                        {/* Service Card 3 */}
                        <div className="card p-8 hover-card" data-aos="fade-up" data-aos-delay="300">
                            <div className="text-brand-500 text-4xl mb-4">
                                <i className="fas fa-robot"></i>
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-4">
                                Intelligence Artificielle
                            </h3>
                            <p className="text-gray-400 mb-6">
                                Solutions innovantes basées sur l'IA pour optimiser le recouvrement.
                            </p>
                            <a href="#contact" className="text-brand-500 font-medium hover:text-brand-400 transition-colors">
                                En savoir plus →
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section Fonctionnalités */}
            <section className="py-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-dark-900 to-dark-800"></div>
                {/* Cercles décoratifs d'arrière-plan */}
                <div className="absolute top-0 left-0 w-96 h-96 bg-brand-500/5 rounded-full filter blur-[100px] transform -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-500/5 rounded-full filter blur-[100px] transform translate-x-1/2 translate-y-1/2"></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16" data-aos="fade-up">
                        <span className="inline-block px-4 py-1 rounded-full text-accent-500 bg-accent-500/10 font-medium mb-4">
                            Fonctionnalités
                        </span>
                        <h2 className="section-title">Une Plateforme Complète</h2>
                        <p className="section-subtitle">
                            Des outils puissants pour une gestion efficace de vos créances
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div className="space-y-8" data-aos="fade-right">
                            {/* Feature 1 */}
                            <div className="group hover:scale-105 transition-all duration-300">
                                <div className="card p-6 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-brand-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="flex gap-6 items-start relative z-10">
                                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center group-hover:bg-brand-500/20 transition-all duration-300">
                                            <i className="fas fa-shield-alt text-2xl text-brand-500"></i>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-brand-400 transition-colors">
                                                Sécurité Maximale
                                            </h3>
                                            <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                                                Protection des données et conformité RGPD garanties pour toutes vos opérations.
                                                <span className="block mt-2 text-sm">
                                                    <i className="fas fa-check text-green-500 mr-2"></i>Chiffrement de bout en bout
                                                    <br />
                                                    <i className="fas fa-check text-green-500 mr-2"></i>Authentification multi-facteurs
                                                    <br />
                                                    <i className="fas fa-check text-green-500 mr-2"></i>Audits de sécurité réguliers
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Feature 2 */}
                            <div className="group hover:scale-105 transition-all duration-300">
                                <div className="card p-6 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-accent-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="flex gap-6 items-start relative z-10">
                                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-accent-500/10 flex items-center justify-center group-hover:bg-accent-500/20 transition-all duration-300">
                                            <i className="fas fa-chart-bar text-2xl text-accent-500"></i>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-accent-400 transition-colors">
                                                Tableau de Bord Intuitif
                                            </h3>
                                            <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                                                Visualisez vos performances en temps réel avec des graphiques détaillés.
                                                <span className="block mt-2 text-sm">
                                                    <i className="fas fa-check text-green-500 mr-2"></i>Analyses en temps réel
                                                    <br />
                                                    <i className="fas fa-check text-green-500 mr-2"></i>Rapports personnalisables
                                                    <br />
                                                    <i className="fas fa-check text-green-500 mr-2"></i>Exports automatisés
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Feature 3 */}
                            <div className="group hover:scale-105 transition-all duration-300">
                                <div className="card p-6 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="flex gap-6 items-start relative z-10">
                                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-all duration-300">
                                            <i className="fas fa-robot text-2xl text-purple-500"></i>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-400 transition-colors">
                                                IA Prédictive
                                            </h3>
                                            <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                                                Anticipez les comportements de paiement grâce à notre intelligence artificielle.
                                                <span className="block mt-2 text-sm">
                                                    <i className="fas fa-check text-green-500 mr-2"></i>Prédiction des retards
                                                    <br />
                                                    <i className="fas fa-check text-green-500 mr-2"></i>Optimisation des relances
                                                    <br />
                                                    <i className="fas fa-check text-green-500 mr-2"></i>Apprentissage continu
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Partie droite avec animation */}
                        <div className="relative" data-aos="fade-left">
                            <div className="relative h-full min-h-[600px] rounded-2xl overflow-hidden">
                                <div className="absolute inset-0 bg-dark-800/50 backdrop-blur-sm border border-dark-700/50"></div>
                                
                                {/* Éléments animés */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="relative w-full max-w-md">
                                        {/* Interface mockup */}
                                        <div className="bg-dark-700/80 rounded-xl p-4 mb-4 transform hover:scale-105 transition-transform duration-300">
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="h-4 bg-dark-600 rounded w-3/4"></div>
                                                <div className="h-4 bg-dark-600 rounded w-1/2"></div>
                                                <div className="h-4 bg-dark-600 rounded w-2/3"></div>
                                            </div>
                                        </div>

                                        {/* Graphique animé */}
                                        <div className="bg-dark-700/80 rounded-xl p-4 transform hover:scale-105 transition-transform duration-300">
                                            <div className="flex justify-between items-end h-32">
                                                {[...Array(7)].map((_, i) => (
                                                    <div
                                                        key={i}
                                                        className="w-4 bg-brand-500/60 rounded-t"
                                                        style={{
                                                            height: `${30 + Math.random() * 70}%`,
                                                            animation: `float ${2 + Math.random()}s ease-in-out infinite`,
                                                            animationDelay: `${i * 0.2}s`
                                                        }}
                                                    ></div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Notifications flottantes */}
                                        {[...Array(3)].map((_, i) => (
                                            <div
                                                key={i}
                                                className="absolute bg-dark-700/90 rounded-lg p-3 shadow-lg"
                                                style={{
                                                    top: `${20 + i * 30}%`,
                                                    right: `${10 + i * 5}%`,
                                                    animation: `float ${3 + i}s ease-in-out infinite`,
                                                    animationDelay: `${i * 0.5}s`
                                                }}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-brand-500"></div>
                                                    <div className="h-2 bg-dark-600 rounded w-20"></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section Témoignages */}
            <section className="py-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-dark-800"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16" data-aos="fade-up">
                        <span className="inline-block px-4 py-1 rounded-full text-brand-500 bg-brand-500/10 font-medium mb-4">
                            Témoignages
                        </span>
                        <h2 className="section-title">Ce que disent nos clients</h2>
                        <p className="section-subtitle">
                            Découvrez les retours d'expérience de nos clients satisfaits
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Testimonial 1 */}
                        <div className="card p-8" data-aos="fade-up" data-aos-delay="100">
                            <div className="flex items-center mb-6">
                                <div className="w-12 h-12 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-500 font-semibold">
                                    JD
                                </div>
                                <div className="ml-4">
                                    <h4 className="text-white font-semibold">Jean Dupont</h4>
                                    <p className="text-gray-400 text-sm">Directeur Financier</p>
                                </div>
                            </div>
                            <p className="text-gray-300">
                                "Une solution complète qui a révolutionné notre gestion des impayés. Le support est réactif et professionnel."
                            </p>
                            <div className="mt-4 flex text-brand-500">
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                            </div>
                        </div>

                        {/* Testimonial 2 */}
                        <div className="card p-8" data-aos="fade-up" data-aos-delay="200">
                            <div className="flex items-center mb-6">
                                <div className="w-12 h-12 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-500 font-semibold">
                                    ML
                                </div>
                                <div className="ml-4">
                                    <h4 className="text-white font-semibold">Marie Laurent</h4>
                                    <p className="text-gray-400 text-sm">Responsable Comptable</p>
                                </div>
                            </div>
                            <p className="text-gray-300">
                                "L'interface est intuitive et les résultats sont au rendez-vous. Nous avons amélioré notre taux de recouvrement de 40%."
                            </p>
                            <div className="mt-4 flex text-brand-500">
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                            </div>
                        </div>

                        {/* Testimonial 3 */}
                        <div className="card p-8" data-aos="fade-up" data-aos-delay="300">
                            <div className="flex items-center mb-6">
                                <div className="w-12 h-12 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-500 font-semibold">
                                    PB
                                </div>
                                <div className="ml-4">
                                    <h4 className="text-white font-semibold">Pierre Bernard</h4>
                                    <p className="text-gray-400 text-sm">CEO</p>
                                </div>
                            </div>
                            <p className="text-gray-300">
                                "Un excellent retour sur investissement. L'automatisation nous fait gagner un temps précieux."
                            </p>
                            <div className="mt-4 flex text-brand-500">
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section Contact */}
            <section id="contact" className="py-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-dark-800 to-dark-900"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16" data-aos="fade-up">
                        <span className="inline-block px-4 py-1 rounded-full text-brand-500 bg-brand-500/10 font-medium mb-4">
                            Contact
                        </span>
                        <h2 className="section-title">Parlons de vos besoins</h2>
                        <p className="section-subtitle">
                            Notre équipe d'experts est là pour vous accompagner
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Formulaire de contact */}
                        <div className="card p-8" data-aos="fade-right">
                            <form className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-white text-sm font-medium mb-2">Nom</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-300 text-white"
                                            placeholder="Votre nom"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-white text-sm font-medium mb-2">Email</label>
                                        <input
                                            type="email"
                                            className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-300 text-white"
                                            placeholder="votre@email.com"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-white text-sm font-medium mb-2">Sujet</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-300 text-white"
                                        placeholder="Sujet de votre message"
                                    />
                                </div>
                                <div>
                                    <label className="block text-white text-sm font-medium mb-2">Message</label>
                                    <textarea
                                        rows="4"
                                        className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-300 text-white"
                                        placeholder="Votre message..."
                                    ></textarea>
                                </div>
                                <button type="submit" className="btn-primary w-full">
                                    Envoyer le message
                                </button>
                            </form>
                        </div>

                        {/* Informations de contact */}
                        <div className="space-y-8" data-aos="fade-left">
                            <div className="card p-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center">
                                        <i className="fas fa-map-marker-alt text-2xl text-brand-500"></i>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-white mb-2">Notre adresse</h3>
                                        <p className="text-gray-400">123 Avenue des Champs-Élysées, 75008 Paris</p>
                                    </div>
                                </div>
                            </div>

                            <div className="card p-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center">
                                        <i className="fas fa-phone text-2xl text-brand-500"></i>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-white mb-2">Téléphone</h3>
                                        <p className="text-gray-400">+33 1 23 45 67 89</p>
                                    </div>
                                </div>
                            </div>

                            <div className="card p-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center">
                                        <i className="fas fa-envelope text-2xl text-brand-500"></i>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-white mb-2">Email</h3>
                                        <p className="text-gray-400">contact@srm-france.com</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-dark-900 border-t border-dark-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="space-y-4">
                            <span className="text-3xl font-display font-bold">
                                <span className="text-brand-500">S</span>
                                <span className="text-gray-400">R</span>
                                <span className="text-brand-500">M</span>
                            </span>
                            <p className="text-gray-400">
                                Solutions innovantes de recouvrement pour votre entreprise.
                            </p>
                            <div className="flex space-x-4">
                                <a href="#" className="w-10 h-10 rounded-full bg-dark-800 flex items-center justify-center text-gray-400 hover:bg-brand-500 hover:text-white transition-all duration-300">
                                    <i className="fab fa-linkedin-in"></i>
                                </a>
                                <a href="#" className="w-10 h-10 rounded-full bg-dark-800 flex items-center justify-center text-gray-400 hover:bg-brand-500 hover:text-white transition-all duration-300">
                                    <i className="fab fa-twitter"></i>
                                </a>
                                <a href="#" className="w-10 h-10 rounded-full bg-dark-800 flex items-center justify-center text-gray-400 hover:bg-brand-500 hover:text-white transition-all duration-300">
                                    <i className="fab fa-facebook-f"></i>
                                </a>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-white font-semibold mb-4">Services</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-400 hover:text-brand-500 transition-colors">Recouvrement Amiable</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-brand-500 transition-colors">Recouvrement Judiciaire</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-brand-500 transition-colors">Intelligence Artificielle</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-brand-500 transition-colors">Conseil Juridique</a></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-white font-semibold mb-4">Entreprise</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-400 hover:text-brand-500 transition-colors">À propos</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-brand-500 transition-colors">Carrières</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-brand-500 transition-colors">Blog</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-brand-500 transition-colors">Contact</a></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-white font-semibold mb-4">Légal</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-400 hover:text-brand-500 transition-colors">Mentions légales</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-brand-500 transition-colors">Politique de confidentialité</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-brand-500 transition-colors">CGU</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-brand-500 transition-colors">RGPD</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-dark-800 mt-12 pt-8 text-center">
                        <p className="text-gray-400">&copy; 2024 SRM. Tous droits réservés.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default App;