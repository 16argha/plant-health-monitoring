import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

function Navbar() {
  const [isVisible, setIsVisible] = useState(true); // State to control visibility
  const [lastScrollY, setLastScrollY] = useState(0); // Track last scroll position
  const cards = Array.from({ length: 5 }, () => [useAnimation(), useAnimation()]);
  const underlineAnimations = Array.from({ length: 5 }, () => useAnimation());

  const handleHover = (index) => {
    cards[index][0].start({ y: '100%' });
    cards[index][1].start({ y: '0' });
    underlineAnimations[index].start({ width: '100%', transition: { duration: 0.35, ease: 'easeInOut' } });
  };

  const handleHoverEnd = (index) => {
    cards[index][0].start({ y: '0%' });
    cards[index][1].start({ y: '-100%' });
    underlineAnimations[index].start({ width: '0%', transition: { duration: 0.35, ease: 'easeInOut' } });
  };

  // Handle scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY) {
        // Scrolling down
        setIsVisible(false);
      } else {
        // Scrolling up
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY); // Update last scroll position
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <div
      className={`fixed z-[999] w-full px-13 py-5 font-['Neue Montreal'] flex justify-between bg-transparent backdrop-blur-[5px] transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="logo cursor-pointer">
        <h1>Logo</h1>
      </div>
      <div className="links flex gap-6">
        {['Plant Health', 'Detect Diseases', 'About us', 'Contact us'].map((item, index) => (
          <div
            key={index}
            className="relative overflow-hidden"
            onMouseEnter={() => handleHover(index)}
            onMouseLeave={() => handleHoverEnd(index)}
          >
            <motion.div
              initial={{ y: '0' }}
              animate={cards[index][0]}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className={`text-base font-normal cursor-pointer ${index === 3 && 'ml-[12vw]'}`}
            >
              {item}
            </motion.div>
            <motion.div
              initial={{ y: '-100%' }}
              animate={cards[index][1]}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className={`absolute inset-0 text font-normal cursor-pointer ${index === 3 && 'ml-[12vw]'}`}
            >
              {item}
            </motion.div>
            <motion.div
              initial={{ width: '0%' }}
              animate={underlineAnimations[index]}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className={`h-[1px] bg-current absolute bottom-0 left-0 ${index === 3 && 'ml-[12vw]'}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Navbar;