import homestyle from "../styles/homestyle.module.css"

import { Facebook, Twitter  } from 'lucide-react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRight } from "@fortawesome/free-solid-svg-icons"
import Footer from "../components/Footer";

const images = [

]

const Home = () => {
    return (
        <div className={homestyle.Container}>
            <div className={homestyle.heroSection}>
                <button>Shop Now</button>
            </div>
            <div className={homestyle.introWrapper}>
                <p>Prime Picks was created to provide opportunity for local artisans, makers.</p>
                <p>Our mission is to connect local producers to local consumers enabling the discovery of amazing products.</p>
            </div>

            <main>
                <h2>Collections</h2>
                <hr />

                <div className={homestyle.collectionsWrapper}>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>

                <div>
                    <img src="/images/sale.jpg" alt="" width="400" height="400"/>
                    <div>
                        <p>Item name</p>
                        <p>$ 34.00</p>
                        <p><em><strong>Shipping</strong></em> calculated at checkout.</p>
                        <hr />
                        <p>Color</p>
                        <div>
                            <p>black</p>
                            <p>White</p>
                        </div>
                        <div>
                            <button>ADD TO CART</button>
                            <p>More payment options</p>
                        </div>

                        <p>Full details <FontAwesomeIcon icon={faArrowRight} /></p>

                        <div>
                            <div>
                                <Facebook />
                                <small>Share</small>
                            </div>
                            <div>
                                <Twitter />
                                <small>Tweet</small>
                            </div>
                        </div>
                        
                    </div>
                </div>

                <h2>Featured Faves</h2>
                <hr />

                <div>
                    <div>
                        <img src="/images/racks.jpg" alt="" width="400" height="550" />
                    </div>
                    <div>
                        <p>See what people are saying!</p>
                    </div>
                </div>

                <div>
                    <h2>Subscribe to our Newsletter</h2>
                    <p>Promotions, new products and sales. Directly to your inbox.</p>

                    <hr />

                    <div>
                        <input type="text" name="email" id="Email" placeholder="Your Email" />
                        <button>SUBSCRIBE</button>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}

export default Home