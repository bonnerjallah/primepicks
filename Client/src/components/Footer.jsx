import { Facebook, Instagram } from 'lucide-react'
import React from 'react'

const Footer = () => {
    return (
        <div>
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
                <div><Facebook /> Facebook</div>
                <div><Instagram /> Instagram</div>
            </div>
            <div>
                <p>&copy; 2024, PRIME PICKS</p>
                <p>BAJ-DEV</p>
            </div>
        </div>
    )
}

export default Footer