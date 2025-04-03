import { useRef, useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import { ActionFunctionArgs, json } from "@remix-run/node";
import { useActionData, Form, useNavigation } from "@remix-run/react";
import { Resend } from "resend";

// Add translations
const translations = {
  en: {
    nav: {
      services: "Services",
      about: "About",
      contact: "Contact"
    },
    hero: {
      title: "Transforming Ideas",
      subtitle: "Into Digital Reality",
      description: "Professional programming services, process optimization, and digitalization solutions.",
      getStarted: "Get Started",
      badges: {
        customSolutions: "Custom Solutions",
        support: "24/7 Support",
        fastDelivery: "Fast Delivery"
      }
    },
    services: {
      title: "Our Services",
      description: "We provide comprehensive solutions to optimize your business processes and digital presence.",
      items: {
        customSoftware: {
          title: "Custom Software Development",
          description: "Tailored software solutions designed to meet your specific business needs and challenges.",
          features: [
            "Custom web applications",
            "Enterprise software",
            "API development",
            "Legacy system modernization"
          ]
        },
        ecommerce: {
          title: "E-commerce Solutions",
          description: "Set up and optimize your online store with popular e-commerce platforms.",
          features: [
            "PrestaShop configuration",
            "WordPress setup",
            "Shopify customization",
            "Payment integration"
          ]
        },
        webMobile: {
          title: "Web & Mobile Applications",
          description: "Responsive and user-friendly applications that work seamlessly across all devices.",
          features: [
            "Responsive web apps",
            "Native mobile apps",
            "Cross-platform solutions",
            "Progressive web apps"
          ]
        },
        ai: {
          title: "AI & Machine Learning Solutions",
          description: "Leverage cutting-edge AI technologies to enhance your business operations and decision-making.",
          features: [
            "RAG (Retrieval Augmented Generation)",
            "AI Agents Development",
            "LLM Integration",
            "Custom AI Solutions"
          ]
        },
        automation: {
          title: "Automation Solutions",
          description: "Reduce manual work and errors by automating repetitive tasks and workflows.",
          features: [
            "Task automation",
            "Integration solutions",
            "Bot development",
            "Workflow optimization"
          ]
        },
        digital: {
          title: "Digital Transformation",
          description: "Guide your business through the digital landscape with strategic technology implementation.",
          features: [
            "Digital strategy",
            "Cloud migration",
            "Security implementation",
            "Digital consulting"
          ]
        },
        devops: {
          title: "DevOps Support",
          description: "Comprehensive DevOps services to streamline your development and deployment processes.",
          features: [
            "CI/CD pipeline setup",
            "Container orchestration",
            "Infrastructure as Code",
            "Monitoring & logging"
          ]
        },
        domain: {
          title: "Domain & Email Services",
          description: "Professional domain and email configuration services for your business.",
          features: [
            "Domain registration",
            "DNS configuration",
            "Email server setup",
            "SSL certificate management"
          ]
        },
        process: {
          title: "Process Optimization",
          description: "Streamline your operations and improve efficiency through careful analysis and implementation.",
          features: [
            "Workflow automation",
            "Process analysis",
            "Performance optimization",
            "Resource allocation"
          ]
        }
      }
    },
    about: {
      title: "About LeanMARK",
      description: "LeanMARK is a one-person company dedicated to providing high-quality programming services, process optimization, and digitalization solutions. With a focus on efficiency and innovation, we help businesses streamline their operations and embrace digital transformation.",
      whyChooseUs: "Why Choose Us?",
      additionalDescription: "Our approach combines technical expertise with a deep understanding of business processes, allowing us to deliver tailored solutions that address your specific needs and challenges."
    },
    contact: {
      title: "Get In Touch",
      description: "Have a project in mind or want to learn more about our services? Send us a message and we'll get back to you as soon as possible.",
      name: "Name",
      email: "Email",
      message: "Message",
      sendMessage: "Send Message",
      sending: "Sending...",
      success: "Thank you for your message! We'll get back to you soon.",
      error: "Failed to send message. Please try again later.",
      validEmail: "✓ Valid email address"
    },
    footer: {
      rights: "All rights reserved."
    },
    skills: [
      "JavaScript", "TypeScript", "Angular", "React", "Node.js", "Nest.js", "Python", "Flutter",
      "SQL", "NoSQL", "AWS", "GCP", "Docker", "CI/CD", "Agile Methodology"
    ],
    benefits: [
      "Personalized approach tailored to your specific needs",
      "Efficient solutions that save time and resources",
      "Clear communication throughout the entire process",
      "Continuous support and maintenance",
      "Scalable solutions that grow with your business",
      "Commitment to quality and excellence"
    ]
  },
  pl: {
    nav: {
      services: "Usługi",
      about: "O nas",
      contact: "Kontakt"
    },
    hero: {
      title: "Przekształcamy Pomysły",
      subtitle: "W Cyfrową Rzeczywistość",
      description: "Profesjonalne usługi programistyczne, optymalizacja procesów i rozwiązania cyfrowe.",
      getStarted: "Rozpocznij",
      badges: {
        customSolutions: "Rozwiązania na Zamówienie",
        support: "Wsparcie 24/7",
        fastDelivery: "Szybka Realizacja"
      }
    },
    services: {
      title: "Nasze Usługi",
      description: "Oferujemy kompleksowe rozwiązania do optymalizacji procesów biznesowych i obecności cyfrowej.",
      items: {
        customSoftware: {
          title: "Rozwój Oprogramowania na Zamówienie",
          description: "Dostosowane rozwiązania programistyczne zaprojektowane pod Twoje specyficzne potrzeby biznesowe.",
          features: [
            "Aplikacje webowe na zamówienie",
            "Oprogramowanie dla przedsiębiorstw",
            "Rozwój API",
            "Modernizacja systemów legacy"
          ]
        },
        ecommerce: {
          title: "Rozwiązania E-commerce",
          description: "Konfiguracja i optymalizacja Twojego sklepu internetowego na popularnych platformach e-commerce.",
          features: [
            "Konfiguracja PrestaShop",
            "Konfiguracja WordPress",
            "Dostosowanie Shopify",
            "Integracja płatności"
          ]
        },
        webMobile: {
          title: "Aplikacje Webowe i Mobilne",
          description: "Responsywne i przyjazne dla użytkownika aplikacje działające płynnie na wszystkich urządzeniach.",
          features: [
            "Responsywne aplikacje webowe",
            "Natywne aplikacje mobilne",
            "Rozwiązania cross-platform",
            "Progresywne aplikacje webowe"
          ]
        },
        ai: {
          title: "Rozwiązania AI i Uczenia Maszynowego",
          description: "Wykorzystaj najnowocześniejsze technologie AI do usprawnienia operacji biznesowych i podejmowania decyzji.",
          features: [
            "RAG (Retrieval Augmented Generation)",
            "Rozwój Agentów AI",
            "Integracja LLM",
            "Rozwiązania AI na zamówienie"
          ]
        },
        automation: {
          title: "Rozwiązania Automatyzacyjne",
          description: "Zmniejsz pracę ręczną i błędy poprzez automatyzację powtarzających się zadań i procesów.",
          features: [
            "Automatyzacja zadań",
            "Rozwiązania integracyjne",
            "Rozwój botów",
            "Optymalizacja procesów"
          ]
        },
        digital: {
          title: "Transformacja Cyfrowa",
          description: "Przewodnik po krajobrazie cyfrowym z strategiczną implementacją technologii.",
          features: [
            "Strategia cyfrowa",
            "Migracja do chmury",
            "Implementacja bezpieczeństwa",
            "Doradztwo cyfrowe"
          ]
        },
        devops: {
          title: "Wsparcie DevOps",
          description: "Kompleksowe usługi DevOps do usprawnienia procesów rozwoju i wdrażania.",
          features: [
            "Konfiguracja CI/CD",
            "Orkiestracja kontenerów",
            "Infrastructure as Code",
            "Monitorowanie i logowanie"
          ]
        },
        domain: {
          title: "Usługi Domenowe i Emailowe",
          description: "Profesjonalne usługi konfiguracji domen i poczty elektronicznej dla Twojego biznesu.",
          features: [
            "Rejestracja domen",
            "Konfiguracja DNS",
            "Konfiguracja serwera pocztowego",
            "Zarządzanie certyfikatami SSL"
          ]
        },
        process: {
          title: "Optymalizacja Procesów",
          description: "Usprawnij operacje i popraw efektywność poprzez staranną analizę i implementację.",
          features: [
            "Automatyzacja procesów",
            "Analiza procesów",
            "Optymalizacja wydajności",
            "Alokacja zasobów"
          ]
        }
      }
    },
    about: {
      title: "O LeanMARK",
      description: "LeanMARK to firma jednoosobowa zajmująca się świadczeniem wysokiej jakości usług programistycznych, optymalizacją procesów i rozwiązaniami cyfrowymi. Skupiając się na efektywności i innowacyjności, pomagamy firmom usprawnić ich operacje i przyjąć transformację cyfrową.",
      whyChooseUs: "Dlaczego My?",
      additionalDescription: "Nasze podejście łączy wiedzę techniczną z głębokim zrozumieniem procesów biznesowych, pozwalając nam dostarczać rozwiązania dostosowane do Twoich specyficznych potrzeb i wyzwań."
    },
    contact: {
      title: "Skontaktuj się",
      description: "Masz projekt na myśli lub chcesz dowiedzieć się więcej o naszych usługach? Wyślij nam wiadomość, a odpowiemy najszybciej jak to możliwe.",
      name: "Imię",
      email: "Email",
      message: "Wiadomość",
      sendMessage: "Wyślij Wiadomość",
      sending: "Wysyłanie...",
      success: "Dziękujemy za wiadomość! Odpowiemy najszybciej jak to możliwe.",
      error: "Nie udało się wysłać wiadomości. Spróbuj ponownie później.",
      validEmail: "✓ Poprawny adres email"
    },
    footer: {
      rights: "Wszelkie prawa zastrzeżone."
    },
    skills: [
      "JavaScript", "TypeScript", "Angular", "React", "Node.js", "Nest.js", "Python", "Flutter",
      "SQL", "NoSQL", "AWS", "GCP", "Docker", "CI/CD", "Metodologia Agile"
    ],
    benefits: [
      "Spersonalizowane podejście dostosowane do Twoich specyficznych potrzeb",
      "Efektywne rozwiązania oszczędzające czas i zasoby",
      "Jasna komunikacja w całym procesie",
      "Ciągłe wsparcie i utrzymanie",
      "Skalowalne rozwiązania rosnące wraz z Twoim biznesem",
      "Zaangażowanie w jakość i doskonałość"
    ]
  }
};

export const meta = () => {
  return [
    { title: "LeanMARK - Professional Programming Services" },
    { name: "description", content: "LeanMARK offers professional programming services, process optimization, and digitalization solutions." },
    { link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }] }
  ];
};

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const message = formData.get("message") as string;
  const language = formData.get("language") as string;

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!name || !email || !message) {
    return json({ success: false, error: "All fields are required" });
  }

  if (!emailRegex.test(email)) {
    return json({ success: false, error: "Please enter a valid email address" });
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "contact@leanmark.pl",
      to: email,
      subject: `New contact from ${name}`,
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    });

    return json({ success: true });
  } catch (error) {
    console.error("Error sending email:", error);
    return json({ success: false, error: "Failed to send message. Please try again later." });
  }
}

export default function Index() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  
  const [language, setLanguage] = useState<'en' | 'pl'>('en');
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    message: "",
  });
  
  const formRef = useRef<HTMLFormElement>(null);
  const [activeSection, setActiveSection] = useState("hero");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Language options with flags
  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'pl', name: 'Polski', flag: '🇵🇱' }
  ];

  const handleLanguageChange = (langCode: 'en' | 'pl') => {
    setLanguage(langCode);
    setIsLanguageDropdownOpen(false);
  };

  // Get current translations
  const t = translations[language];

  // Smooth scroll function
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // Height of the navbar
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  // Handle navigation click
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    scrollToSection(sectionId);
  };

  // Update active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["hero", "services", "about", "contact"];

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { top, bottom } = element.getBoundingClientRect();
          if (top <= 100 && bottom >= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    setFormErrors((prev) => ({ ...prev, [name]: "" }));

    // Real-time email validation
    if (name === 'email') {
      if (!value.trim()) {
        setFormErrors(prev => ({ ...prev, email: "Email is required" }));
      } else if (!validateEmail(value)) {
        setFormErrors(prev => ({ ...prev, email: "Please enter a valid email address" }));
      }
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isFormValid = () => {
    return (
      formState.name.trim() !== "" &&
      formState.email.trim() !== "" &&
      validateEmail(formState.email) &&
      formState.message.trim() !== ""
    );
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Reset errors
    setFormErrors({
      name: "",
      email: "",
      message: "",
    });

    let hasErrors = false;

    // Validate name
    if (!formState.name.trim()) {
      setFormErrors(prev => ({ ...prev, name: "Name is required" }));
      hasErrors = true;
    }

    // Validate email
    if (!formState.email.trim()) {
      setFormErrors(prev => ({ ...prev, email: "Email is required" }));
      hasErrors = true;
    } else if (!validateEmail(formState.email)) {
      setFormErrors(prev => ({ ...prev, email: "Please enter a valid email address" }));
      hasErrors = true;
    }

    // Validate message
    if (!formState.message.trim()) {
      setFormErrors(prev => ({ ...prev, message: "Message is required" }));
      hasErrors = true;
    }

    if (!hasErrors) {
      e.currentTarget.submit();
    }
  };

  // Reset form after successful submission
  useEffect(() => {
    if (actionData?.success) {
      setFormState({
        name: "",
        email: "",
        message: "",
      });
    }
  }, [actionData]);

  // Animation hooks
  const [heroRef, heroInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [servicesRef, servicesInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [aboutRef, aboutInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [contactRef, contactInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Update animation variants for better transitions
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const navItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  // Add new animation variants
  const floatingVariants = {
    initial: { y: 0 },
    animate: {
      y: [-5, 5, -5],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const hoverCardVariants = {
    initial: { scale: 1, y: 0 },
    hover: {
      scale: 1.02,
      y: -5,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
  };

  const skillTagVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.1,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
  };

  // Add new animation variants for hero section
  const heroTextVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  // Add new animation variants for hero illustration
  const heroIllustrationVariants = {
    hidden: { opacity: 0, scale: 0.8, rotate: -5 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const floatingAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-gray-900/80 backdrop-blur-md z-50 border-b border-gray-800">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <motion.div 
            className="flex items-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.img 
              src="/LM_LOGO.jpeg" 
              alt="LeanMARK Logo" 
              className="h-12 w-auto rounded-lg shadow-[0_0_8px_rgba(139,92,246,0.15)]"
              style={{
                background: 'transparent',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
              }}
            />
          </motion.div>
          <div className="hidden md:flex space-x-8 items-center">
            {['services', 'about', 'contact'].map((section) => (
              <motion.a
                key={section}
                href={`#${section}`}
                onClick={(e) => handleNavClick(e, section)}
                className={`hover:text-purple-400 transition-colors ${
                  activeSection === section ? 'text-purple-400' : 'text-white'
                }`}
                variants={navItemVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {t.nav[section as keyof typeof t.nav]}
              </motion.a>
            ))}
          </div>
          
          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
              className="flex items-center space-x-2 text-white hover:text-purple-400 transition-colors"
            >
              <span className="text-xl">{languages.find(l => l.code === language)?.flag}</span>
              <span className="hidden md:inline">{languages.find(l => l.code === language)?.name}</span>
              <svg
                className={`w-4 h-4 transition-transform ${isLanguageDropdownOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {isLanguageDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 py-2 z-50"
              >
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code as 'en' | 'pl')}
                    className={`w-full px-4 py-2 text-left flex items-center space-x-2 hover:bg-gray-700 transition-colors ${
                      language === lang.code ? 'text-purple-400' : 'text-white'
                    }`}
                  >
                    <span className="text-xl">{lang.flag}</span>
                    <span>{lang.name}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </div>

          <div className="md:hidden">
            <button className="text-white" onClick={toggleMobileMenu}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div className="fixed top-16 left-0 w-full bg-gray-900/80 backdrop-blur-md z-40 border-b border-gray-800 mt-4">
          <div className="flex flex-col space-y-4 px-6 py-4">
            {["services", "about", "contact"].map((section) => (
              <a
                key={section}
                href={`#${section}`}
                onClick={(e) => {
                  handleNavClick(e, section);
                  setIsMobileMenuOpen(false);
                }}
                className="text-white hover:text-purple-400 transition-colors"
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Enhanced Hero Section */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-gray-900"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(120,50,255,0.15),transparent_65%)]"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(120,50,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(120,50,255,0.1)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-10"></div>
        </div>
        
        <div className="container mx-auto px-6 z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <motion.div 
              ref={heroRef}
              className="lg:w-1/2 text-left"
              variants={containerVariants}
              initial="hidden"
              animate={heroInView ? "visible" : "hidden"}
            >
              <motion.div variants={heroTextVariants}>
                <h1 className="text-5xl md:text-7xl font-bold mb-6">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
                    {t.hero.title}
                  </span>
                  <br />
                  {t.hero.subtitle}
                </h1>
                
                <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl">
                  {t.hero.description}
                </p>

                <div className="flex flex-wrap gap-4 mb-8">
                  <motion.div 
                    className="flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-full border border-gray-700"
                    whileHover={{ scale: 1.05 }}
                  >
                    <span className="text-purple-400">✓</span>
                    <span>{t.hero.badges.customSolutions}</span>
                  </motion.div>
                  <motion.div 
                    className="flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-full border border-gray-700"
                    whileHover={{ scale: 1.05 }}
                  >
                    <span className="text-purple-400">✓</span>
                    <span>{t.hero.badges.support}</span>
                  </motion.div>
                  <motion.div 
                    className="flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-full border border-gray-700"
                    whileHover={{ scale: 1.05 }}
                  >
                    <span className="text-purple-400">✓</span>
                    <span>{t.hero.badges.fastDelivery}</span>
                  </motion.div>
                </div>
                
                <motion.div variants={itemVariants}>
                  <motion.a 
                    href="#contact" 
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full text-white font-medium hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-purple-500/25 relative overflow-hidden group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="relative z-10">{t.hero.getStarted}</span>
                    <svg className="w-5 h-5 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </motion.a>
                </motion.div>
              </motion.div>
            </motion.div>

            <motion.div 
              className="lg:w-1/2 relative"
              variants={heroIllustrationVariants}
              initial="hidden"
              animate={heroInView ? "visible" : "hidden"}
            >
              <div className="relative">
                {/* Glowing background effect */}
                <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl opacity-30 blur-xl"></div>
                
                <motion.div 
                  className="relative overflow-hidden rounded-2xl border border-gray-700 group"
                  animate={floatingAnimation}
                >
                  {/* Main image container */}
                  <div className="relative">
                    {/* Animated gradient overlay */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 mix-blend-overlay group-hover:opacity-75 transition-opacity duration-500"
                      animate={{
                        background: [
                          "linear-gradient(45deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1))",
                          "linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))",
                          "linear-gradient(45deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1))",
                        ],
                      }}
                      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    />

                    {/* The main image */}
                    <motion.img
                      src="/leanmark_header.jpeg"
                      alt="Workspace Illustration"
                      className="relative z-10 w-full h-full object-cover rounded-2xl transform group-hover:scale-105 transition-transform duration-700 ease-out"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />

                    {/* Floating particles */}
                    <div className="absolute inset-0 z-20 pointer-events-none">
                      {[...Array(8)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-2 h-2 bg-purple-500/30 rounded-full"
                          style={{
                            top: `${20 + Math.random() * 60}%`,
                            left: `${20 + Math.random() * 60}%`,
                          }}
                          animate={{
                            y: [0, -15, 0],
                            x: [0, Math.random() * 10 - 5, 0],
                            scale: [1, 1.5, 1],
                            opacity: [0.3, 0.6, 0.3],
                          }}
                          transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: Math.random() * 2,
                          }}
                        />
                      ))}
                    </div>

                    {/* Corner decorations */}
                    <motion.div
                      className="absolute -top-2 -right-2 w-20 h-20 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full blur-md"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 0.8, 0.5],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                    <motion.div
                      className="absolute -bottom-2 -left-2 w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-md"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 0.8, 0.5],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 2,
                      }}
                    />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Enhanced animated background elements */}
        <div className="absolute inset-0 overflow-hidden z-0">
          {[...Array(5)].map((_, i) => (
            <motion.div 
              key={i}
              className="absolute rounded-full bg-purple-600/10"
              style={{
                width: `${Math.random() * 300 + 50}px`,
                height: `${Math.random() * 300 + 50}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                x: [0, 10, 0],
                scale: [1, 1.1, 1],
                opacity: [0.1, 0.2, 0.1],
              }}
              transition={{
                duration: Math.random() * 10 + 15,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>
      </section>

      {/* Enhanced Services Section */}
      <section id="services" className="py-20 bg-gray-900 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(120,50,255,0.15),transparent_70%)]"></div>
        
        <motion.div 
          ref={servicesRef}
          className="container mx-auto px-6 relative z-10"
          variants={containerVariants}
          initial="hidden"
          animate={servicesInView ? "visible" : "hidden"}
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">{t.services.title}</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              {t.services.description}
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={index}
                className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:border-purple-500/50 transition-all hover:shadow-purple-500/10 hover:shadow-lg relative group"
                whileHover="hover"
                variants={hoverCardVariants}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-blue-600/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <motion.div 
                    className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center mb-4"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <span className="text-xl">{service.icon}</span>
                  </motion.div>
                  <h3 className="text-lg font-bold mb-2 text-white group-hover:text-purple-400 transition-colors">
                    {t.services.items[service.key as keyof typeof t.services.items].title}
                  </h3>
                  <p className="text-white text-sm mb-3 group-hover:text-gray-100 transition-colors">
                    {t.services.items[service.key as keyof typeof t.services.items].description}
                  </p>
                  <ul className="space-y-1.5">
                    {t.services.items[service.key as keyof typeof t.services.items].features.map((feature, i) => (
                      <motion.li 
                        key={i}
                        className="flex items-center gap-2 text-sm text-white group-hover:text-gray-100 transition-colors"
                        whileHover={{ x: 5 }}
                      >
                        <span className="text-purple-400 group-hover:text-purple-300">•</span>
                        {feature}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-900/80 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(120,50,255,0.15),transparent_70%)]"></div>
        
        <motion.div 
          ref={aboutRef}
          className="container mx-auto px-6 relative z-10"
          variants={containerVariants}
          initial="hidden"
          animate={aboutInView ? "visible" : "hidden"}
        >
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div variants={itemVariants} className="lg:w-1/2">
              <h2 className="text-4xl font-bold mb-6">{t.about.title}</h2>
              <p className="text-gray-300 mb-6">
                {t.about.description}
              </p>
              <p className="text-gray-300 mb-6">
                {t.about.additionalDescription}
              </p>
              <div className="flex flex-wrap gap-4">
                {skills.map((skill, index) => (
                  <motion.span 
                    key={index} 
                    className="px-4 py-2 bg-gray-800 rounded-full text-sm border border-gray-700 hover:border-purple-500/50 hover:bg-gray-700/50 transition-all cursor-default"
                    variants={skillTagVariants}
                    whileHover="hover"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="lg:w-1/2">
              <motion.div 
                className="relative"
                variants={floatingVariants}
                initial="initial"
                animate="animate"
              >
                <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl opacity-30 blur-xl"></div>
                <div className="relative bg-gray-800 p-8 rounded-xl border border-gray-700 hover:border-purple-500/50 transition-all hover:shadow-purple-500/10 hover:shadow-lg">
                  <h3 className="text-2xl font-bold mb-4">{t.about.whyChooseUs}</h3>
                  <ul className="space-y-4">
                    {t.benefits.map((benefit: string, index: number) => (
                      <motion.li 
                        key={index} 
                        className="flex items-start group"
                        whileHover={{ x: 5 }}
                      >
                        <span className="text-purple-500 mr-3 group-hover:scale-110 transition-transform">✓</span>
                        <span className="group-hover:text-purple-400 transition-colors">{benefit}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-900 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(120,50,255,0.1),transparent_70%)]"></div>
        
        <motion.div 
          ref={contactRef}
          className="container mx-auto px-6 relative z-10"
          variants={containerVariants}
          initial="hidden"
          animate={contactInView ? "visible" : "hidden"}
        >
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">{t.contact.title}</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              {t.contact.description}
            </p>
          </motion.div>
          
          <div className="max-w-3xl mx-auto">
            <motion.div variants={itemVariants}>
              <Form ref={formRef} method="post" className="space-y-6" onSubmit={handleSubmit}>
                {actionData?.success && (
                  <motion.div 
                    className="bg-green-500/20 border border-green-500 text-green-300 px-4 py-3 rounded"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    {t.contact.success}
                  </motion.div>
                )}
                
                {actionData && 'error' in actionData && (
                  <motion.div 
                    className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    {t.contact.error}
                  </motion.div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                      {t.contact.name}
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formState.name}
                      onChange={handleInputChange}
                      className={`w-full bg-gray-800 border ${
                        formErrors.name ? 'border-red-500' : 'border-gray-700'
                      } rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all hover:border-purple-500/50`}
                      required
                    />
                    {formErrors.name && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                      {t.contact.email}
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formState.email}
                      onChange={handleInputChange}
                      className={`w-full bg-gray-800 border ${
                        formErrors.email ? 'border-red-500' : 'border-gray-700'
                      } rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all hover:border-purple-500/50`}
                      required
                    />
                    {formErrors.email && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>
                    )}
                    {formState.email && !formErrors.email && (
                      <p className="mt-1 text-sm text-green-500">{t.contact.validEmail}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                    {t.contact.message}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formState.message}
                    onChange={handleInputChange}
                    rows={6}
                    className={`w-full bg-gray-800 border ${
                      formErrors.message ? 'border-red-500' : 'border-gray-700'
                    } rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all hover:border-purple-500/50`}
                    required
                  ></textarea>
                  {formErrors.message && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.message}</p>
                  )}
                </div>
                
                <div>
                  <motion.button
                    type="submit"
                    disabled={isSubmitting || !isFormValid()}
                    className={`w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-all shadow-lg relative overflow-hidden group ${
                      isFormValid() 
                        ? 'hover:from-purple-700 hover:to-blue-700 hover:shadow-purple-500/25' 
                        : 'opacity-50 cursor-not-allowed'
                    }`}
                    whileHover={isFormValid() ? { scale: 1.02 } : {}}
                    whileTap={isFormValid() ? { scale: 0.98 } : {}}
                  >
                    <span className="relative z-10">
                      {isSubmitting ? t.contact.sending : t.contact.sendMessage}
                    </span>
                    {isFormValid() && (
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    )}
                  </motion.button>
                </div>
              </Form>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <motion.footer 
        className="bg-gray-900 border-t border-gray-800 py-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <motion.div 
              className="mb-6 md:mb-0"
            >
              <motion.img 
                src="/LM_LOGO.jpeg" 
                alt="LeanMARK Logo" 
                className="h-12 w-auto mb-2 rounded-lg shadow-[0_0_8px_rgba(139,92,246,0.15)]"
                style={{
                  background: 'transparent',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                }}
              />
              {/* <p className="text-gray-400">Professional Programming Services</p> */}
            </motion.div>
            
            <div className="flex space-x-6">
              {["facebook", "twitter", "github", "linkedin"].map((social) => (
                <motion.a
                  key={social}
                  href={`https://${social}.com`}
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    {/* ... existing SVG paths ... */}
                  </svg>
                </motion.a>
              ))}
              <motion.a
                href="mailto:robert.janczak@leanmark.com"
                className="text-gray-400 hover:text-purple-400 transition-colors"
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M2 3h20c1.1 0 2 .9 2 2v14c0 1.1-.9 2-2 2H2c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2zm0 2v.01L12 13 22 5.01V5H2zm0 14h20V7l-10 7L2 7v12z" />
                </svg>
              </motion.a>
              <motion.a
                href="https://www.linkedin.com/in/robert-janczak-b233aa7a/"
                target="_blank"
                className="text-gray-400 hover:text-purple-400 transition-colors"
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.25c-.97 0-1.75-.78-1.75-1.75s.78-1.75 1.75-1.75 1.75.78 1.75 1.75-.78 1.75-1.75 1.75zm13.5 11.25h-3v-5.5c0-1.1-.9-2-2-2s-2 .9-2 2v5.5h-3v-10h3v1.5c.9-1.35 2.5-2.25 4.25-2.25 2.48 0 4.5 2.02 4.5 4.5v6.25z" />
                </svg>
              </motion.a>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col justify-center items-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} LeanMARK. {t.footer.rights}
            </p>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}

// Enhanced services data with new services
const services = [
  {
    key: "customSoftware",
    icon: "💻"
  },
  {
    key: "ecommerce",
    icon: "🛍️"
  },
  {
    key: "webMobile",
    icon: "📱"
  },
  {
    key: "ai",
    icon: "🧠"
  },
  {
    key: "automation",
    icon: "🤖"
  },
  {
    key: "digital",
    icon: "🔒"
  },
  {
    key: "devops",
    icon: "⚙️"
  },
  {
    key: "domain",
    icon: "🌐"
  },
  {
    key: "process",
    icon: "🔄"
  }
];

const skills = [
  "JavaScript", "TypeScript", "Angular", "React", "Node.js", "Nest.js", "Python", "Flutter",
  "SQL", "NoSQL", "AWS", "GCP", "Docker", "CI/CD", "Agile Methodology"
];
