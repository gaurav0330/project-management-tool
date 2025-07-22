import React from "react";
import { motion } from "framer-motion";
import landingImage from "../../assets/landing_img1.jpg";
import taskImg from "../../assets/task.jpg";
import colImg from "../../assets/Team Collaboration.jpg";
import intImg from "../../assets/int.jpg";
import { FaQuoteLeft } from "react-icons/fa";
import { FaTasks, FaUsers, FaPlug } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";

export default function TrelloSection() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [userRole, setUserRole] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserRole(decodedToken.role);
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
  }, [token]);

  const handleDashboardRedirect = () => {
    if (userRole) {
      switch (userRole) {
        case 'Project_Manager':
          navigate('/projectDashboard');
          break;
        case 'Team_Lead':
          navigate('/teamleaddashboard');
          break;
        case 'Team_Member':
          navigate('/teammemberdashboard');
          break;
        default:
          navigate('/');
          break;
      }
    }
  };

  return (
    <section className="py-16 bg-bg-secondary-light dark:bg-bg-secondary-dark transition-colors duration-300">
      <div className="section-container">
        <div className="flex flex-col items-center justify-between lg:flex-row gap-12">
          {/* Left Section */}
          <motion.div
            className="lg:w-1/2"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.5 }}
            viewport={{ once: true }}
          >
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6 text-heading-primary-light dark:text-heading-primary-dark">
              YojanaDesk brings all your tasks, teammates, and tools together
            </h2>
            <p className="font-body text-lg md:text-xl mb-8 text-txt-secondary-light dark:text-txt-secondary-dark leading-relaxed">
              Keep everything in the same place—even if your team isn't.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
              {token ? (
                <button
                  onClick={handleDashboardRedirect}
                  className="btn-primary bg-gradient-to-r from-brand-accent-500 to-brand-accent-600 hover:from-brand-accent-600 hover:to-brand-accent-700 transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
                >
                  Go to Dashboard
                </button>
              ) : (
                <>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="px-6 py-3 bg-bg-primary-light dark:bg-bg-primary-dark text-txt-primary-light dark:text-txt-primary-dark border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary-500 focus:border-transparent transition-all duration-200"
                  />
                  <button className="btn-primary">
                    Sign up—it's free!
                  </button>
                </>
              )}
            </div>
          </motion.div>

          {/* Right Section */}
          <motion.div
            className="lg:w-1/2"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.5 }}
            viewport={{ once: true }}
          >
            <div className="relative">
              <img
                src={landingImage}
                alt="Project Management Tool"
                className="w-full h-auto rounded-2xl shadow-2xl transform transition-transform duration-500 hover:scale-105"
              />
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-brand-primary-500/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-brand-secondary-500/20 rounded-full blur-xl"></div>
            </div>
            
            <motion.div 
              className="mt-8 text-center p-6 bg-bg-accent-light dark:bg-bg-accent-dark rounded-2xl shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h3 className="font-heading text-2xl font-semibold mb-3 text-heading-primary-light dark:text-heading-primary-dark">
                Why Choose YojanaDesk?
              </h3>
              <p className="font-body text-txt-secondary-light dark:text-txt-secondary-dark">
                YojanaDesk helps teams move work forward. Collaborate, manage projects, and reach new productivity peaks.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export function FeaturesSection() {
  const { isDark } = useTheme();
  
  const features = [
    {
      img: taskImg,
      title: "Task Management",
      description: "Organize and prioritize your tasks with ease using our intuitive interface.",
      icon: <FaTasks className="text-3xl text-brand-primary-500 mb-4" />,
    },
    {
      img: colImg,
      title: "Team Collaboration",
      description: "Work together with your team in real-time with seamless communication tools.",
      icon: <FaUsers className="text-3xl text-brand-primary-500 mb-4" />,
    },
    {
      img: intImg,
      title: "Smart Integrations",
      description: "Connect with your favorite tools and services for a unified workflow.",
      icon: <FaPlug className="text-3xl text-brand-primary-500 mb-4" />,
    },
  ];

  return (
    <section className="section-padding py-16 bg-bg-primary-light dark:bg-bg-primary-dark transition-colors duration-300">
      <div className="section-container">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4 text-heading-primary-light dark:text-heading-primary-dark">
            Powerful Features
          </h2>
          <p className="font-body text-xl text-txt-secondary-light dark:text-txt-secondary-dark max-w-2xl mx-auto">
            Everything you need to manage projects efficiently and collaborate seamlessly
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="card hover:shadow-2xl transform hover:-translate-y-2 group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="relative overflow-hidden rounded-xl mb-6">
                <img
                  src={feature.img}
                  alt={feature.title}
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              
              <div className="text-center">
                {feature.icon}
                <h3 className="font-heading text-2xl font-semibold mb-3 text-heading-primary-light dark:text-heading-primary-dark">
                  {feature.title}
                </h3>
                <p className="font-body text-txt-secondary-light dark:text-txt-secondary-dark leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TestimonialsSection() {
  const { isDark } = useTheme();
  
  const testimonials = [
    {
      quote: "YojanaDesk has completely transformed how our development team collaborates. The domain-based approach is genius!",
      name: "Alex Chen",
      role: "Project Manager",
      company: "TechStart Inc.",
      avatar: "AC"
    },
    {
      quote: "Finally, a project management tool that understands software development workflows. Game changer for our team productivity.",
      name: "Jamie Rodriguez", 
      role: "Team Lead",
      company: "DevCorp Solutions",
      avatar: "JR"
    },
    {
      quote: "The best investment we made this year. Our project delivery time improved by 40% since switching to YojanaDesk.",
      name: "Sarah Kim",
      role: "Engineering Manager", 
      company: "InnovateLabs",
      avatar: "SK"
    }
  ];

  return (
    <section className="section-padding py-16 bg-bg-accent-light dark:bg-bg-accent-dark transition-colors duration-300">
      <div className="section-container">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4 text-heading-primary-light dark:text-heading-primary-dark">
            What Our Users Say
          </h2>
          <p className="font-body text-xl text-txt-secondary-light dark:text-txt-secondary-dark max-w-2xl mx-auto">
            Join thousands of satisfied teams who trust YojanaDesk for their project management needs
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="card hover:shadow-2xl transform hover:-translate-y-2 relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="absolute top-4 left-4">
                <FaQuoteLeft className="text-2xl text-brand-primary-500/30" />
              </div>
              
              <div className="pt-8">
                <p className="font-body text-txt-primary-light dark:text-txt-primary-dark italic text-lg leading-relaxed mb-6">
                  "{testimonial.quote}"
                </p>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-brand-primary-500 to-brand-secondary-500 rounded-full flex items-center justify-center">
                    <span className="font-heading text-white font-semibold">
                      {testimonial.avatar}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold text-heading-primary-light dark:text-heading-primary-dark">
                      {testimonial.name}
                    </h4>
                    <p className="font-body text-sm text-txt-secondary-light dark:text-txt-secondary-dark">
                      {testimonial.role} at {testimonial.company}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
