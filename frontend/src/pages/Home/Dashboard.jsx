import React from 'react'
import Navbar from '../../components/Other/NavBar'
import TrelloSection,{ FeaturesSection, TestimonialsSection} from '../../components/dashboard/LandingPage'
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
    <Footer />
    </>
    
  )
}
  
export default Dashboard