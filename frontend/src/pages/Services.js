import React from 'react';
import './services.css'

function Services() {
    return (
        <div className='store-service'>
            <h2 style={{ textAlign: "center", marginTop: "50px", marginBottom: "50px", color:"#00868b" }}>Store Information</h2>
            <div className='store-services-container'>
                <div className='store-service-item'>
                     <h4 className='service-h4'>Created my store, what next?</h4>
                    <p>Once you have created your store:   </p>
                    <ul>
                        <li>(a) Edit it if necessary, using the "edit" button.</li>
                        <li>(b) Add items that you want to sell</li>
                        <li>(c) Post the items for sale.</li>
                        <li>(d) Share your store URL/link with customers</li>
                    </ul>
                </div>
                <div className='store-service-item'>
                     <h4 className='service-h4'>Access my store</h4>
                    <p>When you log in, move the mouse to your name at the top of the page, in the dropdown, click on "userstore". In that same dropdown, you can also access your "Sold items", "Customer orders" and others.</p>
                </div>
                <div className='store-service-item'>
                     <h4 className='service-h4'>Add items for sale</h4>
                    <p>Click on the "add items for sale" button in your store, fill in information about the item and click "create". The item will be added to your store. Repeat the process to add more items.</p>
                    <p>When adding an item to your store, there is a section for you to fill in the amount you will to charge for the delivery of the item. If you are offering free delivery, you can ignore that section.</p>
                    
                </div>
                <div className='store-service-item'>
                     <h4 className='service-h4'>Post</h4>
                    <p>You need to post your store and the items for people to be able to buy from you. The "post" button is attached to both your store and items. You can unpost an item using the "unpost" button.</p>
                </div>
                <div className='store-service-item'>
                     <h4 className='service-h4'>Store url/link</h4>
                    <p>At the top area of your store, there is a link for you. You can copy and share this link with your customers on platforms like whatsApp, Telegram etc, to move more buyers directly to your store.</p>
                </div>
                <div className='store-service-item'>
                     <h4 className='service-h4'>Lock store</h4>
                    <p>You can temporarily lock your store whenever you will not be available to process orders e.g when you travel. This is necessary so that you don't keep the buyer waiting when he/she has paid for an item you posted for sale. When you lock your store, the "open store" button will be available for you to open your store anytime.</p>
                    <p>Note that you will need to post your items again when you open your store.</p>
                </div>
                <div className='store-service-item'>
                     <h4 className='service-h4'>Delivery Capacity</h4>
                    <p>Based on your ability to distribute/send items to the buyer, you are expected to state whether you sell only within your town/city or within your state or across the nation.</p>
                </div>
                
                <div className='store-service-item'>
                     <h4 className='service-h4'>Withdrawal steps</h4>
                    <p>When someone buys from you on Mosganda, the item will be moved to your "sold items".</p>
                    <ul>
                        <li>(1) Move the mouse to your name at the top of the screen, in the dropdown, click on "Sold items".</li>
                        <li>(2) Get the details of the buyer from the item, and send the item to the buyer.</li>
                        <li>(3) When you successfully sent the item, click on the "Payme" button attached to the item and enter your account number.</li>
                        <li>(4) You will receive your money within 24 hours.</li>
                        <li>(5) Within this 24 hours period, we will confirm if the buyer has received the item, so make sure you send the item successfully before clicking the "Payme" button.</li>
                    </ul>
                    <p>Note that the amount you charged for delivery of the item will also be paid together with the selling price.</p>
                    
                </div>
                <div className='store-service-item'>
                     <h4 className='service-h4'>Our service charge</h4>
                    <p>We only charge you 3% when you have successfully sold an item.</p>
                    <p>For example, if you sell an item that cost #1000, our 3% charge is just #30. So you will receive #970 plus the amount you charge for the delivery of the item.</p>
               </div>
            </div>
            
        </div>
    )
}

export default Services
