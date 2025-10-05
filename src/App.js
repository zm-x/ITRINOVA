import React, { useState, useEffect } from 'react';

const App = () => {
  const [isBusiness, setIsBusiness] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [animationsPlayed, setAnimationsPlayed] = useState(false);
  const [sectionVisible, setSectionVisible] = useState(false);
  const [scrollEnabled, setScrollEnabled] = useState(false);
  const [leoSectionAnimated, setLeoSectionAnimated] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [animatedSections, setAnimatedSections] = useState(new Set());

  useEffect(() => {
    document.documentElement.classList.add('dark');
    
    // Restore scroll position to top on refresh
    window.scrollTo(0, 0);
    
    // Restore business/talent mode from localStorage
    const savedMode = localStorage.getItem('itrinova-mode');
    if (savedMode === 'business') {
      setIsBusiness(true);
    } else if (savedMode === 'talent') {
      setIsBusiness(false);
    }
    
    // Set initial loaded state
    setTimeout(() => {
      setIsLoaded(true);
      setAnimationsPlayed(true);
    }, 100);
  }, []);

  // Set LEO section as animated once it becomes visible
  useEffect(() => {
    if (sectionVisible && scrollEnabled && !isSwitching && !leoSectionAnimated) {
      setLeoSectionAnimated(true);
    }
  }, [sectionVisible, scrollEnabled, isSwitching, leoSectionAnimated]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    // Disable scroll completely
    const disableScroll = (e) => {
      e.preventDefault();
      return false;
    };
    
    // Disable all scroll methods
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.addEventListener('wheel', disableScroll, { passive: false });
    document.addEventListener('touchmove', disableScroll, { passive: false });
    document.addEventListener('keydown', (e) => {
      if ([32, 33, 34, 35, 36, 37, 38, 39, 40].includes(e.keyCode)) {
        e.preventDefault();
      }
    });
    
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    // Enable scroll after visible animations complete (buttons finish at 1800ms)
    const scrollTimer = setTimeout(() => {
      setScrollEnabled(true);
      setAnimationsPlayed(true);
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
      document.removeEventListener('wheel', disableScroll);
      document.removeEventListener('touchmove', disableScroll);
    }, 1900); // Just after buttons animation completes
    
    return () => {
      clearTimeout(timer);
      clearTimeout(scrollTimer);
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
      document.removeEventListener('wheel', disableScroll);
      document.removeEventListener('touchmove', disableScroll);
    };
  }, []);

  // Scroll event listener for section animation
  useEffect(() => {
    if (!scrollEnabled) {
      setSectionVisible(false); // Ensure it's false when scroll is disabled
      return;
    }

    const handleScroll = () => {
      const section = document.getElementById('leo-section');
      if (section) {
        const rect = section.getBoundingClientRect();
        // Only trigger when section is actually scrolled into view (more strict)
        const isVisible = rect.top < window.innerHeight * 0.8 && rect.bottom > 0;
        setSectionVisible(isVisible);
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Don't check initial state - let it stay false until scrolled

    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollEnabled]);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animatedSections.has(entry.target.id)) {
            setAnimatedSections((prev) => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    );

    const sections = document.querySelectorAll('[data-animate]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [animatedSections]);

  const toggleMode = () => {
    setIsSwitching(true);
    
    setTimeout(() => {
      const newMode = !isBusiness;
      setIsBusiness(newMode);
      // Save mode to localStorage for persistence after refresh
      localStorage.setItem('itrinova-mode', newMode ? 'business' : 'talent');
    }, 350);
    
    setTimeout(() => {
      setIsSwitching(false);
    }, 1000);
  };

  const toggleFAQ = (index) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  const BusinessIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  );

  const TalentIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isBusiness ? 'bg-white' : 'bg-black'
    }`}>
      <header className={`relative z-20 flex justify-between items-start px-8 py-6 lg:px-12 xl:px-16 transition-all duration-1000 ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}>
        <div className="flex items-start">
          <img 
            src="/logo.jpg" 
            alt="ItriNova Logo" 
            className="h-36 lg:h-42 w-auto rounded-lg shadow-md -mt-4"
          />
        </div>

        <div className="flex items-center space-x-8 self-start mt-2">
          <button
            onClick={toggleMode}
            className="p-4 rounded-full transition-all duration-300 relative group text-blue-400 hover:bg-gray-800 hover:text-blue-300"
            aria-label={`Current: ${isBusiness ? 'Business' : 'Talent'} mode`}
          >
            <div className="relative">
              <div className="transition-all duration-300 group-hover:opacity-0 group-hover:scale-95">
                {isBusiness ? <BusinessIcon /> : <TalentIcon />}
              </div>
              <div className="absolute inset-0 transition-all duration-300 opacity-0 scale-105 group-hover:opacity-100 group-hover:scale-100">
                {isBusiness ? <TalentIcon /> : <BusinessIcon />}
              </div>
            </div>
            <div className={`absolute -bottom-12 left-1/2 transform -translate-x-1/2 px-3 py-1 text-xs rounded-md opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap border shadow-lg ${
              isBusiness ? 'bg-white text-black border-gray-300' : 'bg-gray-800 text-white border-gray-700'
            }`}>
              Switch to {isBusiness ? 'Talent' : 'Business'}
            </div>
          </button>

          <div className="flex items-center text-2xl lg:text-3xl text-white">
            <button className="hover:underline transition-all duration-300 font-semibold">
              Login
            </button>
          </div>
        </div>
      </header>

      <main className="relative flex flex-col items-center justify-center min-h-[calc(100vh-160px)] px-6 pb-20 -mt-16">
        <div className={`text-center mb-8 z-10 relative max-w-6xl mx-auto transition-all duration-1200 ${
          isSwitching ? 'delay-0' : 'delay-300'
        } ${
          (animationsPlayed && !isSwitching) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h1 className={`text-3xl lg:text-4xl xl:text-5xl mb-6 font-medium tracking-wide transition-all duration-1000 ${
            isSwitching ? 'delay-0' : 'delay-500'
          } ${
            (animationsPlayed && !isSwitching) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          } text-white`}>
            WELCOME TO
          </h1>
          <div className="text-center mb-8">
            <h2 className={`text-7xl lg:text-8xl xl:text-9xl font-bold tracking-wider transition-all duration-1000 ${
              isSwitching ? 'delay-0' : 'delay-700'
            } ${
              (animationsPlayed && !isSwitching) ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}>
              <span className="text-gradient">ITRINOVA</span>
            </h2>
            <p className={`text-xl lg:text-2xl font-medium mt-6 transition-all duration-1000 ${
              isSwitching ? 'delay-0' : 'delay-1000'
            } ${
              (animationsPlayed && !isSwitching) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              {isBusiness 
                ? <span className="inline backdrop-blur-[3px] bg-gray-800/40 px-1.5 rounded text-white">Connecting Space Industry Leaders with Elite LEO Talent</span>
                : <span className="text-white">Your Gateway to the Commercial Space Economy</span>
              }
            </p>
          </div>
        </div>

        <div className={`text-center mb-16 z-10 relative max-w-4xl mx-auto transition-all ${
          isSwitching ? 'duration-300 delay-0' : 'duration-1000 delay-1750'
        } ${
          (animationsPlayed && !isSwitching) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          {isBusiness ? (
            <div>
              <p className="text-xl lg:text-2xl xl:text-3xl leading-relaxed mb-8">
                <span className="inline backdrop-blur-[3px] bg-gray-800/40 px-1.5 rounded text-white">The premier talent acquisition platform for space industry leaders</span>
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-8">
                <div className="text-center">
                  <div className="text-3xl lg:text-4xl font-bold text-blue-400 mb-2">
                    <span className="inline-block backdrop-blur-[3px] bg-gray-800/40 px-1.5 rounded">98%</span>
                  </div>
                  <div className="text-sm lg:text-base">
                    <span className="inline backdrop-blur-[3px] bg-gray-800/40 px-1.5 rounded text-white">Hiring Success Rate</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl lg:text-4xl font-bold text-blue-400 mb-2">
                    <span className="inline-block backdrop-blur-[3px] bg-gray-800/40 px-1.5 rounded">45 Days</span>
                  </div>
                  <div className="text-sm lg:text-base">
                    <span className="inline backdrop-blur-[3px] bg-gray-800/40 px-1.5 rounded text-white">Average Time to Hire</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl lg:text-4xl font-bold text-blue-400 mb-2">
                    <span className="inline-block backdrop-blur-[3px] bg-gray-800/40 px-1.5 rounded">500+</span>
                  </div>
                  <div className="text-sm lg:text-base">
                    <span className="inline backdrop-blur-[3px] bg-gray-800/40 px-1.5 rounded text-white">Partner Companies</span>
                  </div>
                </div>
              </div>
              <p className="text-lg leading-relaxed max-w-3xl mx-auto">
                <span className="inline backdrop-blur-[3px] bg-gray-800/40 px-1.5 rounded text-white">Access pre vetted LEO professionals with verified credentials, security clearances, and NASA backed certifications.</span>{' '}
                <span className="inline backdrop-blur-[3px] bg-gray-800/40 px-1.5 rounded text-white">Our AI powered matching system reduces hiring time by 60% while ensuring regulatory compliance.</span>
              </p>
            </div>
          ) : (
            <div>
              <p className="text-xl lg:text-2xl xl:text-3xl leading-relaxed text-gray-300 mb-8">
                The exclusive professional network for the commercial Low Earth Orbit workforce
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-8">
                <div className="text-center">
                  <div className="text-3xl lg:text-4xl font-bold text-blue-400 mb-2">15,000+</div>
                  <div className="text-sm lg:text-base text-gray-400">Active Professionals</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl lg:text-4xl font-bold text-blue-400 mb-2">$180K</div>
                  <div className="text-sm lg:text-base text-gray-400">Average Salary</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl lg:text-4xl font-bold text-blue-400 mb-2">95%</div>
                  <div className="text-sm lg:text-base text-gray-400">Job Placement Rate</div>
                </div>
              </div>
              <p className="text-lg text-gray-400 leading-relaxed">
                Connect with top space companies, showcase your expertise, and advance your career in the rapidly growing Low Earth Orbit industry. Access exclusive opportunities and NASA backed training programs.
              </p>
            </div>
          )}
        </div>

        <div className={`flex flex-col lg:flex-row gap-6 mb-20 z-10 relative transition-all ${
          isSwitching ? 'duration-300 delay-0' : 'duration-1000 delay-1800'
        } ${
          (animationsPlayed && !isSwitching) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {isBusiness ? (
            <>
              <button className="px-12 py-4 text-lg lg:text-xl bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 font-semibold shadow-lg hover:shadow-xl">
                Start Hiring
              </button>
              <button className="px-12 py-4 text-lg lg:text-xl border-2 rounded-lg transition-colors duration-300 font-semibold shadow-lg hover:shadow-xl border-white text-black hover:bg-white">
                View Talent Pool
              </button>
            </>
          ) : (
            <>
              <button className="px-12 py-4 text-lg lg:text-xl bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 font-semibold shadow-lg hover:shadow-xl">
                Join the Network
              </button>
              <button className="px-12 py-4 text-lg lg:text-xl border-2 rounded-lg transition-colors duration-300 font-semibold shadow-lg hover:shadow-xl border-white text-white hover:bg-white hover:text-black">
                Browse Jobs
              </button>
            </>
          )}
        </div>
      </main>





<div className={`absolute top-0 left-0 w-full h-full z-0 overflow-hidden transition-all duration-2000 ${
        isSwitching ? 'delay-0' : 'delay-200'
      } ${
        (isLoaded && !isSwitching) ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
      }`}>
        <img
          src={isBusiness ? "/earth1.png" : "/earth.png"}
          alt="Earth"
          className="w-full h-full object-cover object-center sketch-filter transition-all duration-2000"
          style={{
            minWidth: '1920px',
            filter: 'contrast(1.2) brightness(0.8) saturate(0.8) sepia(0.1)'
          }}
        />
        {/* Seamless vertical blur gradient for business mode - perfect white background match */}
        <div 
          className={`absolute bottom-0 left-0 right-0 h-64 z-1 transition-opacity duration-1000 ${
            isBusiness ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            background: `linear-gradient(to bottom, 
              transparent 0%, 
              rgba(255, 255, 255, 0.02) 5%,
              rgba(255, 255, 255, 0.08) 15%,
              rgba(255, 255, 255, 0.18) 25%,
              rgba(255, 255, 255, 0.35) 35%,
              rgba(255, 255, 255, 0.55) 45%,
              rgb(255, 255, 255) 70%,
              rgb(255, 255, 255) 100%)`
          }}
        />
      </div>
      <section 
        id="leo-section"
        className={`relative z-20 py-20 px-8 lg:px-12 xl:px-16 transition-all duration-1000 ${
          isBusiness ? 'bg-white -mt-32' : 'bg-black/80 backdrop-blur-xl -mt-8'
        }`}>
        <div className="max-w-7xl mx-auto">
          {/* How It Works Content */}
          <div id="how-it-works" data-animate className={`text-center mb-16 transition-all duration-1000 ${
            animatedSections.has('how-it-works') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <h2 className={`text-4xl lg:text-5xl font-bold mb-6 ${
              isBusiness ? 'text-gray-900' : 'text-white'
            }`}>
              How It Works
            </h2>
            <p className={`text-xl max-w-3xl mx-auto ${
              isBusiness ? 'text-gray-600' : 'text-gray-300'
            }`}>
              {isBusiness 
                ? 'Get started with ITRINOVA in four simple steps to build your team and find your next space industry hire'
                : 'Launch your space industry career with our streamlined onboarding process'
              }
            </p>
          </div>

          <div className="relative">
            {/* Connection Line */}
            <div className="absolute top-10 left-0 right-0 h-0.5 bg-gray-400 hidden lg:block" style={{left: '12.5%', right: '12.5%'}}></div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {/* Step 1 */}
              <div className={`text-center relative transition-all duration-700 ${
                animatedSections.has('how-it-works') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`} style={{transitionDelay: animatedSections.has('how-it-works') ? '200ms' : '0ms'}}>
                <div className="relative mb-6">
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto text-2xl font-bold relative z-10 ${
                    isBusiness ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                  }`}>
                    1
                  </div>
                </div>
                <h3 className={`text-xl font-semibold mb-4 ${
                  isBusiness ? 'text-gray-900' : 'text-white'
                }`}>
                  {isBusiness ? 'Registration' : 'Sign Up'}
                </h3>
                <p className={`text-sm ${
                  isBusiness ? 'text-gray-600' : 'text-gray-300'
                }`}>
                  {isBusiness 
                    ? 'Set up your company profile and specify hiring requirements, security clearance needs, and space industry expertise criteria'
                    : 'Create your professional profile and upload your credentials and certifications'
                  }
                </p>
              </div>


              {/* Step 2 */}
              <div className={`text-center relative transition-all duration-700 ${
                animatedSections.has('how-it-works') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`} style={{transitionDelay: animatedSections.has('how-it-works') ? '400ms' : '0ms'}}>
                <div className="relative mb-6">
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto text-2xl font-bold relative z-10 ${
                    isBusiness ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                  }`}>
                    2
                  </div>
                </div>
                <h3 className={`text-xl font-semibold mb-4 ${
                  isBusiness ? 'text-gray-900' : 'text-white'
                }`}>
                  {isBusiness ? 'Confident Hiring' : 'Start Learning'}
                </h3>
                <p className={`text-sm ${
                  isBusiness ? 'text-gray-600' : 'text-gray-300'
                }`}>
                  {isBusiness 
                    ? 'Gain exclusive access to verified talent profiles featuring NASA certifications, security clearances, and relevant project experience'
                    : 'Begin your aerospace journey with NASA-certified training courses. Build essential skills in orbital mechanics, spacecraft systems, and space operations to enhance your qualifications.'
                  }
                </p>
              </div>

              {/* Step 3 */}
              <div className={`text-center relative transition-all duration-700 ${
                animatedSections.has('how-it-works') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`} style={{transitionDelay: animatedSections.has('how-it-works') ? '600ms' : '0ms'}}>
                <div className="relative mb-6">
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto text-2xl font-bold relative z-10 ${
                    isBusiness ? "bg-blue-600 text-white" : "bg-blue-500 text-white"
                  }`}>
                    3
                  </div>
                </div>
                <h3 className={`text-xl font-semibold mb-4 ${
                  isBusiness ? "text-gray-900" : "text-white"
                }`}>
                  {isBusiness ? "Candidate Review" : "Apply & Interview"}
                </h3>
                <p className={`text-sm ${
                  isBusiness ? "text-gray-600" : "text-gray-300"
                }`}>
                  {isBusiness 
                    ? "Explore detailed candidate profiles to identify the best fits for your mission requirements"
                    : "Submit applications to aerospace companies and participate in interviews. Showcase your newly acquired skills and certifications to potential employers."
                  }
                </p>
              </div>

              {/* Step 4 */}
              <div className={`text-center relative transition-all duration-700 ${
                animatedSections.has('how-it-works') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`} style={{transitionDelay: animatedSections.has('how-it-works') ? '800ms' : '0ms'}}>
                <div className="relative mb-6">
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto text-2xl font-bold relative z-10 ${
                    isBusiness ? "bg-blue-600 text-white" : "bg-blue-500 text-white"
                  }`}>
                    4
                  </div>
                </div>
                <h3 className={`text-xl font-semibold mb-4 ${
                  isBusiness ? "text-gray-900" : "text-white"
                }`}>
                  {isBusiness ? "Secure Hiring" : "Launch Your Career"}
                </h3>
                <p className={`text-sm ${
                  isBusiness ? "text-gray-600" : "text-gray-300"
                }`}>
                  {isBusiness 
                    ? "Engage and hire top candidates securely, ensuring full compliance with space industry regulations and mission-critical standards"
                    : "Successfully land your dream position in the LEO industry and begin your exciting career in commercial space operations."
                  }
                </p>
              </div>
            </div>

            {/* CTA Button */}
            <div className="text-center mt-12 relative z-50">
              <button className="px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-300 hover:scale-105 bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl relative z-50" style={{backgroundColor: '#2563eb !important', opacity: '1 !important'}}>
                {isBusiness ? 'Start Hiring Today' : 'Join the Network'}
              </button>
            </div>
          </div>

          {/* Enterprise-Grade Platform Features Content */}
          <div id="platform-features" data-animate className={`mt-20 mb-20 transition-all duration-1000 ${
            animatedSections.has('platform-features') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="text-center mb-16">
              <h2 className={`text-4xl lg:text-5xl font-bold mb-6 ${
                isBusiness ? 'text-black' : 'text-white'
              }`}>
                {isBusiness ? 'Enterprise-Grade Platform Features' : 'Professional Development Ecosystem'}
              </h2>
              <p className={`text-xl max-w-3xl mx-auto ${
                isBusiness ? 'text-gray-600' : 'text-gray-300'
              }`}>
                {isBusiness 
                  ? 'Advanced tools and compliance features designed for space industry recruitment leaders'
                  : 'Comprehensive resources to accelerate your career in the commercial space economy'
                }
              </p>
            </div>

            <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
              {/* Advanced Analytics Section */}
              <div className={`p-8 rounded-2xl transition-all duration-700 ${
                isBusiness ? 'bg-gray-50 hover:bg-gray-100' : 'bg-gray-800 hover:bg-gray-750'
              } ${
                animatedSections.has('platform-features') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`} style={{transitionDelay: animatedSections.has('platform-features') ? '200ms' : '0ms'}}>
                <div className="flex items-center mb-6">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                    isBusiness ? 'bg-purple-600' : 'bg-purple-500'
                  }`}>
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3 3V21H21V19H5V3H3M7 17H9V10H7V17M11 17H13V7H11V17M15 17H17V13H15V17M19 17H21V4H19V17Z"/>
                    </svg>
                  </div>
                  <h3 className={`text-2xl font-bold ${
                    isBusiness ? 'text-gray-900' : 'text-white'
                  }`}>
                    {isBusiness ? 'Advanced Analytics' : 'AI-Driven Skill Assessment'}
                  </h3>
                </div>
                <p className={`text-lg leading-relaxed ${
                  isBusiness ? 'text-gray-700' : 'text-gray-300'
                }`}>
                  {isBusiness
                    ? 'Comprehensive workforce analytics and predictive modeling for strategic talent planning. Track hiring metrics, performance indicators, and market trends.'
                    : 'Our AI analyzes your current skills against aerospace industry demands to create personalized learning paths. Identify skill gaps in orbital mechanics, satellite systems, or space operations, then receive tailored recommendations for NASA-certified training modules and hands-on simulations.'
                  }
                </p>
              </div>

              {/* Compliance & Security Section */}
              <div className={`p-8 rounded-2xl transition-all duration-700 ${
                isBusiness ? 'bg-gray-50 hover:bg-gray-100' : 'bg-gray-800 hover:bg-gray-750'
              } ${
                animatedSections.has('platform-features') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`} style={{transitionDelay: animatedSections.has('platform-features') ? '400ms' : '0ms'}}>
                <div className="flex items-center mb-6">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                    isBusiness ? 'bg-green-600' : 'bg-green-500'
                  }`}>
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9L10,17Z"/>
                    </svg>
                  </div>
                  <h3 className={`text-2xl font-bold ${
                    isBusiness ? 'text-gray-900' : 'text-white'
                  }`}>
                    {isBusiness ? 'Compliance & Security' : 'Verified Aerospace Credentials'}
                  </h3>
                </div>
                <p className={`text-lg leading-relaxed ${
                  isBusiness ? 'text-gray-700' : 'text-gray-300'
                }`}>
                  {isBusiness
                    ? 'Built-in compliance verification and security clearance validation. All candidates undergo rigorous background checks and credential verification processes.'
                    : 'Build your verified aerospace profile with compliant credential tracking and security clearance verification. Our platform helps you showcase your existing certifications and guides you through obtaining NASA-certified training, from basic aerospace fundamentals to advanced space systems operations, all recognized by leading space industry employers.'
                  }
                </p>
              </div>

              {/* Market Intelligence Section */}
              <div className={`p-8 rounded-2xl transition-all duration-700 ${
                isBusiness ? 'bg-gray-50 hover:bg-gray-100' : 'bg-gray-800 hover:bg-gray-750'
              } ${
                animatedSections.has('platform-features') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`} style={{transitionDelay: animatedSections.has('platform-features') ? '600ms' : '0ms'}}>
                <div className="flex items-center mb-6">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                    isBusiness ? 'bg-blue-600' : 'bg-blue-500'
                  }`}>
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z"/>
                    </svg>
                  </div>
                  <h3 className={`text-2xl font-bold ${
                    isBusiness ? 'text-gray-900' : 'text-white'
                  }`}>
                    {isBusiness ? 'Market Intelligence' : 'Smart Career Matching'}
                  </h3>
                </div>
                <p className={`text-lg leading-relaxed ${
                  isBusiness ? 'text-gray-700' : 'text-gray-300'
                }`}>
                  {isBusiness
                    ? 'Real-time salary benchmarks, skill demand analytics, and competitive intelligence. Make data-driven hiring decisions with comprehensive LEO industry insights.'
                    : 'Get matched to aerospace roles and projects that align with your verified skills, security clearance level, and career goals. Our AI considers your learning progress, location preferences, and salary expectations to connect you with opportunities in satellite operations, space manufacturing, and orbital research.'
                  }
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Q&A Section */}
      <section className={`relative z-10 py-20 ${isBusiness ? 'bg-white' : 'bg-black'}`}>
        <div className="max-w-6xl mx-auto px-8 lg:px-12 xl:px-16">
          <div id="faq-section" data-animate className={`text-center mb-16 transition-all duration-1000 ${
            animatedSections.has('faq-section') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <h2 className={`text-4xl lg:text-5xl font-bold mb-6 ${
              isBusiness ? 'text-gray-900' : 'text-white'
            }`}>
              Frequently Asked Questions
            </h2>
            <p className={`text-xl max-w-3xl mx-auto ${
              isBusiness ? 'text-gray-600' : 'text-gray-300'
            }`}>
              {isBusiness 
                ? 'Get answers to common questions about hiring LEO professionals through our platform'
                : 'Everything you need to know about advancing your career in the commercial space industry'
              }
            </p>
          </div>

          <div className="space-y-4">
            {isBusiness ? (
              <>
                {/* Business Q&A */}
                {[
                  {
                    question: "How does ITRINOVA verify candidate credentials and security clearances?",
                    answer: "We partner with NASA and government agencies to verify all security clearances, certifications, and technical credentials. Our rigorous 7-step verification process includes background checks, technical assessments, and continuous monitoring to ensure compliance with space industry standards."
                  },
                  {
                    question: "What is the average time to hire through your platform?",
                    answer: "Our AI-powered matching system reduces hiring time by 60% compared to traditional methods. The average time to hire is 45 days, with many positions filled within 30 days. Our pre-vetted talent pool and automated compliance screening significantly accelerate the process."
                  },
                  {
                    question: "How do you ensure regulatory compliance for space industry hiring?",
                    answer: "Our platform is built with compliance at its core. We maintain current knowledge of aerospace industry regulations and standards. All candidates undergo mandatory compliance training, and we provide automated documentation and audit trails to ensure your hiring process meets all regulatory requirements."
                  },
                  {
                    question: "What types of LEO professionals are available on your platform?",
                    answer: "Our talent pool includes satellite engineers, mission operations specialists, orbital mechanics experts, space systems analysts, payload specialists, and regulatory compliance officers. All professionals have verified experience in commercial space operations, government contracts, or NASA programs."
                  },
                  {
                    question: "What are your pricing plans and how does billing work?",
                    answer: "We offer flexible pricing models including subscription plans and per-hire fees. Our enterprise packages include unlimited job postings, priority candidate matching, and dedicated account management. Contact our sales team for custom pricing based on your hiring volume and specific requirements."
                  },
                  {
                    question: "How do I get started with posting jobs on ITRINOVA?",
                    answer: "Getting started is simple. Create your company profile, verify your business credentials, and post your first job listing. Our team will review and approve your account within 24 hours. You can then access our talent pool and start receiving qualified candidate matches immediately."
                  },
                  {
                    question: "Can I integrate ITRINOVA with my existing HR systems?",
                    answer: "Yes, we offer API integrations with popular HR platforms and applicant tracking systems. Our technical team can help you set up seamless data flow between ITRINOVA and your existing workflows, ensuring a smooth hiring process without disrupting your current operations."
                  },
                  {
                    question: "What support do you provide during the hiring process?",
                    answer: "We provide comprehensive support including dedicated account managers, technical assistance, and hiring consultation. Our team helps with job posting optimization, candidate screening guidance, and interview coordination to ensure successful placements."
                  }
                ].map((faq, index) => (
                  <div key={index} className={`rounded-lg ${isBusiness ? 'bg-white shadow-md' : 'bg-gray-800'} border ${isBusiness ? 'border-gray-200' : 'border-gray-700'} overflow-hidden`}>
                    <button
                      onClick={() => toggleFAQ(index)}
                      className={`w-full p-6 text-left flex justify-between items-center hover:${isBusiness ? 'bg-gray-50' : 'bg-gray-750'} transition-colors duration-200`}
                    >
                      <h3 className={`text-xl font-semibold ${isBusiness ? 'text-gray-900' : 'text-white'}`}>
                        {faq.question}
                      </h3>
                      <svg
                        className={`w-6 h-6 ${isBusiness ? 'text-gray-600' : 'text-gray-400'} transform transition-transform duration-200 ${
                          expandedFAQ === index ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <div className={`transition-all duration-300 ease-in-out ${
                      expandedFAQ === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    } overflow-hidden`}>
                      <div className="px-6 pb-6">
                        <p className={`text-lg leading-relaxed ${isBusiness ? 'text-gray-700' : 'text-gray-300'}`}>
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <>
                {/* Talent Q&A */}
                {[
                  {
                    question: "What qualifications do I need to join the ITRINOVA network?",
                    answer: "We welcome professionals with aerospace engineering degrees, relevant certifications, or proven experience in space-related fields. Security clearances are preferred but not required for initial registration. Our NASA-certified training programs can help you gain the credentials needed for LEO industry roles."
                  },
                  {
                    question: "How does the NASA-certified training program work?",
                    answer: "Our training modules cover orbital mechanics, spacecraft systems, mission planning, and safety protocols. Courses are self-paced and include hands-on simulations. Upon completion, you receive industry-recognized certifications that space employers actively seek"
                  },
                  {
                    question: "What is the average salary for LEO industry professionals?",
                    answer: "The average salary for LEO professionals on our platform is $180K, with entry-level positions starting at $95K and senior roles reaching $300K+. Salaries vary based on security clearance level, specialization, and experience. Our market intelligence tools provide real-time salary benchmarks for your specific role and location."
                  },
                  {
                    question: "How do you match me with the right opportunities?",
                    answer: "Our AI-driven system analyzes your skills, experience, security clearance, and career goals to match you with relevant opportunities. We consider factors like company culture, project types, growth potential, and compensation expectations. You'll receive personalized job recommendations and career advancement guidance."
                  },
                  {
                    question: "Is there a cost to join the ITRINOVA platform?",
                    answer: "Basic membership is completely free and includes access to job opportunities, basic training modules, and career resources. Premium memberships offer additional benefits like priority job matching, advanced training courses, and personalized career coaching at competitive rates."
                  },
                  {
                    question: "How do I create an effective profile to attract employers?",
                    answer: "Focus on highlighting your technical skills, relevant experience, and any certifications you hold. Include specific projects you've worked on and quantifiable achievements. Our profile optimization tools provide suggestions to improve your visibility and match rate with potential employers."
                  },
                  {
                    question: "Can I work remotely or do I need to relocate for positions?",
                    answer: "We offer both remote and on-site opportunities. Many positions in the space industry offer flexible work arrangements, while others may require presence at specific facilities. You can filter job searches by location preferences and work arrangement types to find opportunities that match your lifestyle."
                  },
                  {
                    question: "What career support services do you provide?",
                    answer: "We offer comprehensive career support including resume reviews, interview preparation, salary negotiation guidance, and ongoing career development planning. Our career advisors specialize in the aerospace industry and can help you navigate your professional growth path."
                  },
                  {
                    question: "How often are new job opportunities posted?",
                    answer: "New opportunities are posted daily across various aerospace sectors. We recommend enabling job alerts and keeping your profile updated to receive notifications about relevant positions. Our AI matching system continuously scans for opportunities that align with your skills and preferences."
                  }
                ].map((faq, index) => (
                  <div key={index} className={`rounded-lg ${isBusiness ? 'bg-white shadow-md' : 'bg-gray-800'} border ${isBusiness ? 'border-gray-200' : 'border-gray-700'} overflow-hidden`}>
                    <button
                      onClick={() => toggleFAQ(index)}
                      className={`w-full p-6 text-left flex justify-between items-center hover:${isBusiness ? 'bg-gray-50' : 'bg-gray-750'} transition-colors duration-200`}
                    >
                      <h3 className={`text-xl font-semibold ${isBusiness ? 'text-gray-900' : 'text-white'}`}>
                        {faq.question}
                      </h3>
                      <svg
                        className={`w-6 h-6 ${isBusiness ? 'text-gray-600' : 'text-gray-400'} transform transition-transform duration-200 ${
                          expandedFAQ === index ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <div className={`transition-all duration-300 ease-in-out ${
                      expandedFAQ === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    } overflow-hidden`}>
                      <div className="px-6 pb-6">
                        <p className={`text-lg leading-relaxed ${isBusiness ? 'text-gray-700' : 'text-gray-300'}`}>
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </section>

      {/* Pricing Section - Business Only */}
      {isBusiness && (
        <section className="relative z-10 py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-8 lg:px-12 xl:px-16">
            <div id="pricing-section" data-animate className={`text-center mb-16 transition-all duration-1000 ${
              animatedSections.has('pricing-section') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-gray-900">
                Enterprise Pricing Plans
              </h2>
              <p className="text-xl max-w-4xl mx-auto text-gray-600 mb-8">
                Flexible SaaS subscription models designed to scale with your aerospace organization. 
                Annual licensing fees are charged to organizations based on user count or site access, not individual users.
              </p>
              <div className="bg-blue-50 rounded-xl p-6 max-w-5xl mx-auto">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">Why Organizations Choose ITRINOVA</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-blue-800">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Faster, More Accurate Hiring
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Enhanced Workforce Analytics
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Aerospace Regulation Compliance
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Continuous Skill Development
                  </div>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 mb-16">
              {/* Essential Plan */}
              <div className={`bg-white rounded-2xl shadow-lg border border-gray-200 p-8 relative transition-all duration-700 ${
                animatedSections.has('pricing-section') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`} style={{transitionDelay: animatedSections.has('pricing-section') ? '200ms' : '0ms'}}>
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Basic Talent Matching</h3>
                  <p className="text-gray-600 mb-6">Essential AI-powered talent matching for growing aerospace organizations</p>
                  <div className="text-3xl font-bold text-blue-600 mb-2">Annual License</div>
                  <p className="text-sm text-gray-500">Per user/month, billed annually</p>
                </div>
                
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">AI-powered talent matching</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Basic compliance verification</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Standard reporting & analytics</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Email support</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Up to 50 active job postings</span>
                  </li>
                </ul>
                
                <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200">
                  Request Demo
                </button>
              </div>

              {/* Professional Plan */}
              <div className={`bg-white rounded-2xl shadow-xl border-2 border-blue-500 p-8 relative transition-all duration-700 ${
                animatedSections.has('pricing-section') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`} style={{transitionDelay: animatedSections.has('pricing-section') ? '400ms' : '0ms'}}>
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold">Most Popular</span>
                </div>
                
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Full Platform Access</h3>
                  <p className="text-gray-600 mb-6">Complete platform with Custom AI features for established aerospace organizations</p>
                  <div className="text-3xl font-bold text-blue-600 mb-2">Site License</div>
                  <p className="text-sm text-gray-500">Unlimited users per location</p>
                </div>
                
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Everything in Essential, plus:</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Advanced AI matching algorithms</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Enterprise-grade security & compliance</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Custom reporting & market intelligence</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Priority phone & chat support</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Unlimited job postings</span>
                  </li>
                </ul>
                
                <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200">
                  Request Demo
                </button>
              </div>

              {/* Enterprise Plan */}
              <div className={`bg-white rounded-2xl shadow-lg border border-gray-200 p-8 relative transition-all duration-700 ${
                animatedSections.has('pricing-section') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`} style={{transitionDelay: animatedSections.has('pricing-section') ? '600ms' : '0ms'}}>
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Premium Services</h3>
                  <p className="text-gray-600 mb-6">Enterprise-grade solution with professional services for large aerospace organizations</p>
                  <div className="text-3xl font-bold text-blue-600 mb-2">Custom Pricing</div>
                  <p className="text-sm text-gray-500">Tailored to your organization size and needs</p>
                </div>
                
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Everything in Professional, plus:</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Custom AI model training</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">White-label platform options</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Dedicated account management</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Professional services & consulting</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">SLA guarantees & 24/7 support</span>
                  </li>
                </ul>
                
                <button className="w-full bg-gray-900 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-colors duration-200">
                  Contact Sales
                </button>
              </div>
            </div>

            {/* Value Propositions */}
            <div className="bg-white rounded-2xl p-8 mb-16">
              <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Why Choose ITRINOVA Enterprise?</h3>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">60% Faster Hiring</h4>
                  <p className="text-gray-600">Reduce time-to-hire from months to weeks with AI-powered matching and pre-vetted talent pools.</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">Higher Retention Rates</h4>
                  <p className="text-gray-600">Improve talent retention by 40% through better cultural and technical fit matching.</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">Enterprise Security</h4>
                  <p className="text-gray-600">Enterprise-compliant platform with SOC 2 certification and government-grade security protocols.</p>
                </div>
              </div>
            </div>

            {/* Additional Revenue Streams */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 mb-16">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Beyond Subscription: Complete Value Ecosystem</h3>
              <p className="text-center text-gray-600 mb-8 max-w-3xl mx-auto">
                In addition to annual subscription fees, ITRINOVA offers additional value-added services that enhance your talent management capabilities and drive continuous improvement.
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Paid Certifications</h4>
                  <p className="text-sm text-gray-600">NASA-certified training programs and industry credentials with marketplace commissions</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Content Marketplace</h4>
                  <p className="text-sm text-gray-600">Premium courses and specialized content with revenue sharing from paid offerings</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Professional Services</h4>
                  <p className="text-sm text-gray-600">Custom consulting, implementation, and integration services billed separately</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Custom Integration</h4>
                  <p className="text-sm text-gray-600">Tailored API connections and system integrations with professional service fees</p>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="text-center bg-gray-900 rounded-2xl p-12">
              <h3 className="text-3xl font-bold text-white mb-4">Ready to Transform Your Aerospace Hiring?</h3>
              <p className="text-xl text-gray-300 mb-6 max-w-3xl mx-auto">
                Join leading aerospace organizations including NASA contractors who have reduced hiring time by 60% and improved talent retention by 40% with ITRINOVA's enterprise-grade platform.
              </p>
              <div className="bg-gray-800 rounded-lg p-6 mb-8 max-w-4xl mx-auto">
                <h4 className="text-lg font-semibold text-white mb-4">Enterprise-Grade Security & Compliance</h4>
                <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-300">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    SOC 2 Type II Certified
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Government-Grade Security
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Aerospace Regulation Compliant
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                <button className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors duration-200">
                  Schedule a Demo
                </button>
                <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-gray-900 transition-colors duration-200">
                  Contact Sales for Custom Pricing
                </button>
              </div>
              <p className="text-gray-400 text-sm mb-2">
                <strong>Pricing tailored to your organization size and needs</strong> • Contract terms based on user count or site access
              </p>
              <p className="text-gray-500 text-xs">
                No setup fees • 30-day trial available • Enterprise deployments include dedicated support
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Job Types Explained Section - Talent Only */}
      {!isBusiness && (
        <section className="relative z-10 py-20 bg-black">
          <div className="max-w-7xl mx-auto px-8 lg:px-12 xl:px-16">
            <div id="job-types-section" data-animate className={`text-center mb-16 transition-all duration-1000 ${
              animatedSections.has('job-types-section') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-white">
                Aerospace Job Types Explained
              </h2>
              <p className="text-xl max-w-4xl mx-auto text-gray-300">
                Understanding the diverse roles in the aerospace industry. From hands-on engineering to strategic leadership, 
                discover which career path aligns with your skills and interests.
              </p>
            </div>

            <div className="space-y-12">
              {/* Engineering Roles */}
              <div className="bg-gray-800 rounded-3xl p-8 border border-gray-700">
                <div className="flex items-center mb-8">
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mr-6">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2M12 21L10.91 15.74L2 15L10.91 14.26L12 8L13.09 14.26L22 15L13.09 15.74L12 21Z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-white mb-2">Engineering & Design Roles</h3>
                    <p className="text-blue-400 font-medium">Technical problem-solving and system development</p>
                  </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="border-l-4 border-blue-400 pl-6">
                      <h4 className="text-xl font-semibold text-white mb-3">Spacecraft Systems Engineer</h4>
                      <p className="text-gray-300 mb-4">Design and integrate complex spacecraft systems including power, thermal, propulsion, and communication subsystems. Ensure all components work together seamlessly.</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm">Systems Integration</span>
                        <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm">MATLAB/Simulink</span>
                        <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm">Requirements Analysis</span>
                      </div>
                      <p className="text-blue-400 font-semibold">$105K - $165K annually</p>
                    </div>

                    <div className="border-l-4 border-blue-400 pl-6">
                      <h4 className="text-xl font-semibold text-white mb-3">Propulsion Engineer</h4>
                      <p className="text-gray-300 mb-4">Develop rocket engines, thrusters, and propulsion systems. Work on chemical, electric, and hybrid propulsion technologies for various mission requirements.</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm">Fluid Dynamics</span>
                        <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm">Combustion</span>
                        <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm">CFD Analysis</span>
                      </div>
                      <p className="text-blue-400 font-semibold">$110K - $180K annually</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="border-l-4 border-blue-400 pl-6">
                      <h4 className="text-xl font-semibold text-white mb-3">Avionics Engineer</h4>
                      <p className="text-gray-300 mb-4">Design electronic systems for spacecraft including flight computers, navigation systems, and communication equipment. Ensure reliable operation in harsh space environments.</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm">Embedded Systems</span>
                        <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm">FPGA Design</span>
                        <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm">Real-time Systems</span>
                      </div>
                      <p className="text-blue-400 font-semibold">$95K - $155K annually</p>
                    </div>

                    <div className="border-l-4 border-blue-400 pl-6">
                      <h4 className="text-xl font-semibold text-white mb-3">Structural Engineer</h4>
                      <p className="text-gray-300 mb-4">Analyze and design spacecraft structures to withstand launch loads, thermal cycling, and space environment. Ensure structural integrity throughout mission life.</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm">FEA Analysis</span>
                        <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm">Materials Science</span>
                        <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm">ANSYS/NASTRAN</span>
                      </div>
                      <p className="text-blue-400 font-semibold">$90K - $150K annually</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Operations Roles */}
              <div className="bg-gray-800 rounded-3xl p-8 border border-gray-700">
                <div className="flex items-center mb-8">
                  <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mr-6">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12,3L1,9L12,15L21,10.09V17H23V9M5,13.18V17.18L12,21L19,17.18V13.18L12,17L5,13.18Z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-white mb-2">Operations & Mission Control</h3>
                    <p className="text-purple-400 font-medium">Real-time mission management and spacecraft operations</p>
                  </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="border-l-4 border-purple-400 pl-6">
                      <h4 className="text-xl font-semibold text-white mb-3">Mission Control Specialist</h4>
                      <p className="text-gray-300 mb-4">Monitor spacecraft health, execute mission operations, and respond to anomalies in real-time. Work in mission control centers managing active space missions.</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm">Real-time Operations</span>
                        <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm">Telemetry Analysis</span>
                        <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm">Emergency Response</span>
                      </div>
                      <p className="text-purple-400 font-semibold">$85K - $140K annually</p>
                    </div>

                    <div className="border-l-4 border-purple-400 pl-6">
                      <h4 className="text-xl font-semibold text-white mb-3">Flight Dynamics Engineer</h4>
                      <p className="text-gray-300 mb-4">Calculate orbital trajectories, plan maneuvers, and predict spacecraft positions. Essential for mission planning and navigation operations.</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm">Orbital Mechanics</span>
                        <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm">STK/GMAT</span>
                        <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm">Trajectory Analysis</span>
                      </div>
                      <p className="text-purple-400 font-semibold">$95K - $160K annually</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="border-l-4 border-purple-400 pl-6">
                      <h4 className="text-xl font-semibold text-white mb-3">Ground Station Operator</h4>
                      <p className="text-gray-300 mb-4">Operate ground communication systems, manage data downlinks, and coordinate with spacecraft. Ensure reliable communication between Earth and space assets.</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm">RF Systems</span>
                        <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm">Antenna Operations</span>
                        <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm">Data Processing</span>
                      </div>
                      <p className="text-purple-400 font-semibold">$70K - $120K annually</p>
                    </div>

                    <div className="border-l-4 border-purple-400 pl-6">
                      <h4 className="text-xl font-semibold text-white mb-3">Mission Planning Analyst</h4>
                      <p className="text-gray-300 mb-4">Develop detailed mission timelines, coordinate activities between teams, and optimize mission operations for maximum efficiency and science return.</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm">Project Planning</span>
                        <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm">Resource Optimization</span>
                        <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm">Timeline Management</span>
                      </div>
                      <p className="text-purple-400 font-semibold">$80K - $135K annually</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Leadership & Management Roles */}
              <div className="bg-gray-800 rounded-3xl p-8 border border-gray-700">
                <div className="flex items-center mb-8">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mr-6">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M16 4C18.2 4 20 5.8 20 8S18.2 12 16 12 12 10.2 12 8 13.8 4 16 4M16 14C18.7 14 24 15.3 24 18V20H8V18C8 15.3 13.3 14 16 14M8.5 4C10.4 4 12 5.6 12 7.5S10.4 11 8.5 11 5 9.4 5 7.5 6.6 4 8.5 4M8.5 13C11.5 13 17 14.5 17 17.5V19H0V17.5C0 14.5 5.5 13 8.5 13Z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-white mb-2">Leadership & Management</h3>
                    <p className="text-green-400 font-medium">Strategic oversight and program management</p>
                  </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="border-l-4 border-green-400 pl-6">
                      <h4 className="text-xl font-semibold text-white mb-3">Program Manager</h4>
                      <p className="text-gray-300 mb-4">Lead large-scale space programs from conception to completion. Manage budgets, timelines, and cross-functional teams to deliver successful missions.</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm">Program Management</span>
                        <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm">Budget Management</span>
                        <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm">Risk Management</span>
                      </div>
                      <p className="text-green-400 font-semibold">$150K - $250K annually</p>
                    </div>

                    <div className="border-l-4 border-green-400 pl-6">
                      <h4 className="text-xl font-semibold text-white mb-3">Systems Integration Lead</h4>
                      <p className="text-gray-300 mb-4">Oversee the integration of multiple spacecraft subsystems. Ensure all components work together and meet mission requirements through comprehensive testing.</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm">Systems Engineering</span>
                        <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm">Integration Testing</span>
                        <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm">Technical Leadership</span>
                      </div>
                      <p className="text-green-400 font-semibold">$130K - $200K annually</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="border-l-4 border-green-400 pl-6">
                      <h4 className="text-xl font-semibold text-white mb-3">Business Development Director</h4>
                      <p className="text-gray-300 mb-4">Identify new market opportunities, develop strategic partnerships, and drive business growth in the commercial space sector.</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm">Market Analysis</span>
                        <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm">Strategic Planning</span>
                        <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm">Partnership Development</span>
                      </div>
                      <p className="text-green-400 font-semibold">$140K - $220K annually</p>
                    </div>

                    <div className="border-l-4 border-green-400 pl-6">
                      <h4 className="text-xl font-semibold text-white mb-3">Chief Technology Officer</h4>
                      <p className="text-gray-300 mb-4">Set technical vision and strategy for aerospace companies. Lead innovation initiatives and guide technology development across the organization.</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm">Technology Strategy</span>
                        <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm">Innovation Leadership</span>
                        <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm">Executive Management</span>
                      </div>
                      <p className="text-green-400 font-semibold">$200K - $400K+ annually</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="text-center mt-16">
              <div className="bg-gray-800 rounded-3xl p-8 border border-gray-700">
                <h3 className="text-2xl font-bold text-white mb-4">Find Your Perfect Aerospace Role</h3>
                <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                  Use our AI-powered matching system to discover which aerospace career path aligns with your skills, experience, and interests.
                </p>
                <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl">
                  Take Career Assessment
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Success Stories Section - Talent Only */}
      {!isBusiness && (
        <section className="relative z-10 py-20 bg-black">
          <div className="max-w-7xl mx-auto px-8 lg:px-12 xl:px-16">
            <div id="success-stories-section" data-animate className={`text-center mb-16 transition-all duration-1000 ${
              animatedSections.has('success-stories-section') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-white">
                Success Stories
              </h2>
              <p className="text-xl max-w-3xl mx-auto text-gray-300">
                Real professionals who transformed their careers through ITRINOVA's platform and training programs.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 mb-16">
              {/* Story 1 */}
              <div className={`bg-gray-900 rounded-2xl p-8 border border-gray-800 hover:border-blue-500/50 transition-all duration-700 ${
                animatedSections.has('success-stories-section') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`} style={{transitionDelay: animatedSections.has('success-stories-section') ? '200ms' : '0ms'}}>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-bold text-lg">SM</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">Sarah Martinez</h4>
                    <p className="text-gray-400 text-sm">Satellite Operations Engineer</p>
                  </div>
                </div>
                <p className="text-gray-300 mb-4 leading-relaxed">
                  "From aerospace engineering graduate to mission control specialist in 8 months. ITRINOVA's NASA-certified training gave me the practical skills employers were looking for."
                </p>
                <div className="flex items-center text-sm text-gray-400 mb-4">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  SpaceX • Hawthorne, CA
                </div>
                <div className="flex items-center text-xs text-green-400">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  65% salary increase
                </div>
              </div>

              {/* Story 2 */}
              <div className={`bg-gray-900 rounded-2xl p-8 border border-gray-800 hover:border-purple-500/50 transition-all duration-700 ${
                animatedSections.has('success-stories-section') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`} style={{transitionDelay: animatedSections.has('success-stories-section') ? '400ms' : '0ms'}}>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-bold text-lg">JC</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">James Chen</h4>
                    <p className="text-gray-400 text-sm">Propulsion Systems Engineer</p>
                  </div>
                </div>
                <p className="text-gray-300 mb-4 leading-relaxed">
                  "Career transition from automotive to aerospace seemed impossible until I found ITRINOVA. The AI matching connected me with the perfect role at Blue Origin."
                </p>
                <div className="flex items-center text-sm text-gray-400 mb-4">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  Blue Origin • Kent, WA
                </div>
                <div className="flex items-center text-xs text-green-400">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Career pivot in 6 months
                </div>
              </div>

              {/* Story 3 */}
              <div className={`bg-gray-900 rounded-2xl p-8 border border-gray-800 hover:border-green-500/50 transition-all duration-700 ${
                animatedSections.has('success-stories-section') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`} style={{transitionDelay: animatedSections.has('success-stories-section') ? '600ms' : '0ms'}}>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-bold text-lg">AR</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">Aisha Rahman</h4>
                    <p className="text-gray-400 text-sm">Mission Planning Specialist</p>
                  </div>
                </div>
                <p className="text-gray-300 mb-4 leading-relaxed">
                  "ITRINOVA's training modules and career guidance helped me land my dream job at NASA JPL. The platform's network opened doors I never knew existed."
                </p>
                <div className="flex items-center text-sm text-gray-400 mb-4">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  NASA JPL • Pasadena, CA
                </div>
                <div className="flex items-center text-xs text-green-400">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Dream job achieved
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-400 mb-2">92%</div>
                <p className="text-gray-400 text-sm">Job placement rate</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-400 mb-2">45%</div>
                <p className="text-gray-400 text-sm">Average salary increase</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-400 mb-2">6 months</div>
                <p className="text-gray-400 text-sm">Average time to placement</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-400 mb-2">500+</div>
                <p className="text-gray-400 text-sm">Partner companies</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Our Partners Section */}
      <section className={`relative z-10 py-16 ${isBusiness ? 'bg-white' : 'bg-black'}`}>
        <div id="partners-section" data-animate className={`max-w-7xl mx-auto px-8 lg:px-12 xl:px-16 transition-all duration-1000 ${
          animatedSections.has('partners-section') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h3 className={`text-3xl lg:text-4xl xl:text-5xl font-bold text-center mb-12 ${isBusiness ? 'text-gray-800' : 'text-white'}`}>
            Our Partners
          </h3>
          <p className={`text-lg lg:text-xl text-center mb-16 max-w-3xl mx-auto ${isBusiness ? 'text-gray-600' : 'text-gray-300'}`}>
            Proudly supported by our hackathon and innovation partners
          </p>
        </div>
          
        {/* Logo Carousel Container - Full Width */}
        <div className="relative overflow-hidden bg-white py-8 w-full">
          <div className="flex scroll-animation whitespace-nowrap">
              {/* Create multiple sets for seamless infinite loop */}
              {Array.from({ length: 4 }, (_, setIndex) => (
                <div key={`set-${setIndex}`} className="flex items-center flex-shrink-0">
                  {['/1337.png', '/sole.png', '/nasaspace.png', '/1337.png', '/sole.png', '/nasaspace.png'].map((logo, i) => (
                    <div key={`logo-${setIndex}-${i}`} className="flex-shrink-0 mx-8 lg:mx-12 xl:mx-16">
                      <a
                        href={
                          logo === '/1337.png' 
                            ? "https://admission.1337.ma/en/users/sign_in"
                            : logo === '/sole.png'
                            ? "https://um6p.ma/"
                            : logo === '/nasaspace.png'
                            ? "https://www.spaceappschallenge.org/"
                            : "/"
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block cursor-pointer"
                      >
                        <img
                          src={logo}
                          alt={
                            logo === '/1337.png' 
                              ? "1337 School"
                              : logo === '/sole.png'
                              ? "UM6P University"
                              : logo === '/nasaspace.png'
                              ? "NASA Space Apps Challenge"
                              : "Partner Logo"
                          }
                          className={`w-auto opacity-60 hover:opacity-100 transition-opacity duration-300 filter grayscale hover:grayscale-0 ${
                            logo === '/nasaspace.png' 
                              ? 'h-16 lg:h-20 xl:h-24' 
                              : logo === '/sole.png'
                              ? 'h-28 lg:h-36 xl:h-44'
                              : 'h-24 lg:h-32 xl:h-40'
                          }`}
                        />
                      </a>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
      </section>

      {/* Footer Section */}
      <footer className={`relative z-10 py-16 px-8 lg:px-12 xl:px-16 transition-all duration-1000 border-t-2 border-black ${
        isSwitching 
          ? 'bg-gray-500 text-gray-500'
          : isBusiness 
            ? 'bg-white text-black' 
            : 'bg-black text-white'
      }`}>
        <div className="max-w-7xl mx-auto">
          {/* Main Footer Content */}
          <div className="grid lg:grid-cols-12 gap-12 mb-12">
            {/* Company Info - Left Side */}
            <div className="lg:col-span-5">
              {/* Logo */}
              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <div className="bg-black p-2 rounded-lg mr-3">
                    <img 
                      src="/logo.jpg" 
                      alt="ItriNova Logo" 
                      className="h-16 w-auto rounded-lg"
                    />
                  </div>
                  <span className={`text-2xl font-bold tracking-wide ${
                    isBusiness ? 'text-black' : 'text-white'
                  }`}>
                    ITRINOVA
                  </span>
                </div>
              </div>
              
              {/* Mission Statement */}
              <p className={`text-lg leading-relaxed mb-6 ${
                isBusiness ? 'text-gray-700' : 'text-gray-300'
              }`}>
                Empowering LEO workforce development through NASA-backed training programs, AI-driven talent matchmaking, and secure, compliant industry connections. ITRINOVA bridges the gap between exceptional space professionals and pioneering commercial LEO enterprises, accelerating innovation in the new space economy.
              </p>
              
              {/* Learn More CTA */}
              <a 
                href="/" 
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-300"
              >
                Learn More
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
            
            {/* Navigation Links - Right Side */}
            <div className="lg:col-span-7">
              <div className="grid md:grid-cols-4 gap-8">
                {/* Column 1 - Platform */}
                <div>
                  <h4 className={`text-lg font-semibold mb-4 ${
                    isBusiness ? 'text-black' : 'text-white'
                  }`}>Platform</h4>
                  <ul className="space-y-3">
                    <li><a href="/" className={`transition-colors duration-300 ${
                      isBusiness 
                        ? 'text-gray-600 hover:text-black' 
                        : 'text-gray-300 hover:text-white'
                    }`}>Talent Network</a></li>
                    <li><a href="/" className={`transition-colors duration-300 ${
                      isBusiness 
                        ? 'text-gray-600 hover:text-black' 
                        : 'text-gray-300 hover:text-white'
                    }`}>NASA Courses</a></li>
                    <li><a href="/" className={`transition-colors duration-300 ${
                      isBusiness 
                        ? 'text-gray-600 hover:text-black' 
                        : 'text-gray-300 hover:text-white'
                    }`}>Enterprise Solutions</a></li>
                    <li><a href="/" className={`transition-colors duration-300 ${
                      isBusiness 
                        ? 'text-gray-600 hover:text-black' 
                        : 'text-gray-300 hover:text-white'
                    }`}>AI Matching Engine</a></li>
                    <li><a href="/" className={`transition-colors duration-300 ${
                      isBusiness 
                        ? 'text-gray-600 hover:text-black' 
                        : 'text-gray-300 hover:text-white'
                    }`}>LEO Job Board</a></li>
                  </ul>
                </div>
                
                {/* Column 2 - Company */}
                <div>
                  <h4 className={`text-lg font-semibold mb-4 ${
                    isBusiness ? 'text-black' : 'text-white'
                  }`}>Company</h4>
                  <ul className="space-y-3">
                    <li><a href="/" className={`transition-colors duration-300 ${
                      isBusiness 
                        ? 'text-gray-600 hover:text-black' 
                        : 'text-gray-300 hover:text-white'
                    }`}>About Us</a></li>
                    <li><a href="/" className={`transition-colors duration-300 ${
                      isBusiness 
                        ? 'text-gray-600 hover:text-black' 
                        : 'text-gray-300 hover:text-white'
                    }`}>Careers</a></li>
                    <li><a href="/" className={`transition-colors duration-300 ${
                      isBusiness 
                        ? 'text-gray-600 hover:text-black' 
                        : 'text-gray-300 hover:text-white'
                    }`}>Contact</a></li>
                    <li><a href="/" className={`transition-colors duration-300 ${
                      isBusiness 
                        ? 'text-gray-600 hover:text-black' 
                        : 'text-gray-300 hover:text-white'
                    }`}>Leadership Team</a></li>
                    <li><a href="/" className={`transition-colors duration-300 ${
                      isBusiness 
                        ? 'text-gray-600 hover:text-black' 
                        : 'text-gray-300 hover:text-white'
                    }`}>Partners</a></li>
                  </ul>
                </div>
                
                {/* Column 3 - Compliance & Security */}
                <div>
                  <h4 className={`text-lg font-semibold mb-4 ${
                    isBusiness ? 'text-black' : 'text-white'
                  }`}>Compliance & Security</h4>
                  <ul className="space-y-3">
                    <li><a href="/" className={`transition-colors duration-300 ${
                      isBusiness 
                        ? 'text-gray-600 hover:text-black' 
                        : 'text-gray-300 hover:text-white'
                    }`}>Regulatory Compliance</a></li>
                    <li><a href="/" className={`transition-colors duration-300 ${
                      isBusiness 
                        ? 'text-gray-600 hover:text-black' 
                        : 'text-gray-300 hover:text-white'
                    }`}>Responsible AI</a></li>
                    <li><a href="/" className={`transition-colors duration-300 ${
                      isBusiness 
                        ? 'text-gray-600 hover:text-black' 
                        : 'text-gray-300 hover:text-white'
                    }`}>Privacy Policy</a></li>
                    <li><a href="/" className={`transition-colors duration-300 ${
                      isBusiness 
                        ? 'text-gray-600 hover:text-black' 
                        : 'text-gray-300 hover:text-white'
                    }`}>Security Center</a></li>
                    <li><a href="/" className={`transition-colors duration-300 ${
                      isBusiness 
                        ? 'text-gray-600 hover:text-black' 
                        : 'text-gray-300 hover:text-white'
                    }`}>Data Protection</a></li>
                  </ul>
                </div>
                
                {/* Column 4 - Support & Resources */}
                <div>
                  <h4 className={`text-lg font-semibold mb-4 ${
                    isBusiness ? 'text-black' : 'text-white'
                  }`}>Support & Resources</h4>
                  <ul className="space-y-3">
                    <li><a href="/" className={`transition-colors duration-300 ${
                      isBusiness 
                        ? 'text-gray-600 hover:text-black' 
                        : 'text-gray-300 hover:text-white'
                    }`}>FAQs</a></li>
                    <li><a href="/" className={`transition-colors duration-300 ${
                      isBusiness 
                        ? 'text-gray-600 hover:text-black' 
                        : 'text-gray-300 hover:text-white'
                    }`}>Blog</a></li>
                    <li><a href="/" className={`transition-colors duration-300 ${
                      isBusiness 
                        ? 'text-gray-600 hover:text-black' 
                        : 'text-gray-300 hover:text-white'
                    }`}>Help Center</a></li>
                    <li><a href="/" className={`transition-colors duration-300 ${
                      isBusiness 
                        ? 'text-gray-600 hover:text-black' 
                        : 'text-gray-300 hover:text-white'
                    }`}>Documentation</a></li>
                    <li><a href="/" className={`transition-colors duration-300 ${
                      isBusiness 
                        ? 'text-gray-600 hover:text-black' 
                        : 'text-gray-300 hover:text-white'
                    }`}>API Guide</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          {/* Bottom Section */}
          <div className={`pt-8 ${
            isBusiness ? '' : 'border-t border-gray-700'
          }`}>
            <div className="flex flex-col md:flex-row justify-between items-center">
              {/* Social Media Links */}
              <div className="flex space-x-6 mb-4 md:mb-0">
                <a href="/" className={`transition-colors duration-300 ${
                  isBusiness 
                    ? 'text-gray-500 hover:text-black' 
                    : 'text-gray-400 hover:text-white'
                }`} aria-label="LinkedIn">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a href="/" className={`transition-colors duration-300 ${
                  isBusiness 
                    ? 'text-gray-500 hover:text-black' 
                    : 'text-gray-400 hover:text-white'
                }`} aria-label="Twitter/X">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a href="/" className={`transition-colors duration-300 ${
                  isBusiness 
                    ? 'text-gray-500 hover:text-black' 
                    : 'text-gray-400 hover:text-white'
                }`} aria-label="YouTube">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>
              
              {/* Copyright */}
              <div className={`text-sm ${
                isBusiness ? 'text-gray-500' : 'text-gray-400'
              }`}>
                © {new Date().getFullYear()} ITRINOVA. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default App;
