import React from 'react'
import Navbar from '../../components/Other/NavBar'
import TrelloSection,{ FeaturesSection, TestimonialsSection} from '../../components/dashboard/AdminPanel'

import Footer from "../../components/Other/Footer"; 
const Dashboard = () => {
  return (
    <>
    <Navbar />
    <TrelloSection />
    {/* Features Section */}
    <FeaturesSection/>
    {/* Testimonials Section */}
    <TestimonialsSection/>
    {/* Footer Section */}
    <Footer />
    </>
    
  )
}
  
export default Dashboard