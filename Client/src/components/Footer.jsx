import { Facebook, Instagram } from 'lucide-react'
import footerstyle from "../styles/footerstyle.module.css"

const Footer = () => {
    return (
        <div className={footerstyle.mainContainer}>
            <div>
                <p>Search</p>
                <p>Gift Card</p>
                <p>Gift Boxes</p>
                <p>Contact Us</p>
                <p>Shipping Policy</p>
            </div>
            <div>
                <p>Refund Policy</p>
                <p>Privacy Policy</p>
                <p>Terms of Services</p>
                <p>Do not sell my personal information</p>
            </div>
            <div>
                <p><Facebook /> Facebook</p>
                <p><Instagram /> Instagram</p>
            </div>
            <div>
                <p>&copy; 2024, PRIME PICKS</p>
                <p>BAJ-DEV</p>
            </div>
        </div>
    )
}

export default Footer