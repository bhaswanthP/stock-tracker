const cron = require('node-cron');
const StockAlert = require('../models/StockAlert');
const { getStockPrice } = require('../services/stockService');
const { sendEmail } = require('../services/emailService');

cron.schedule('*/1 * * * *', async () => {
  try {
    const alerts = await StockAlert.find({ status: 'Active' });
    
    if (alerts.length == 0) {
      console.log('No alerts');
    }
    
    for (const alert of alerts) {
        const price = await getStockPrice(alert.symbol);
        console.log(`${alert.symbol}: ${price}`);
        
        if (price >= alert.targetPrice) {
          await sendEmail(
            alert.email, 
            `📈 Stock Alert: ${alert.symbol} has reached your target!`, 
            `Hello,
            We have an important update on one of your monitored stocks:
            
            - Stock Symbol: ${alert.symbol}
            - Current Price: ${price}
            - Target Price: ${alert.targetPrice}
            
            The current price of ${alert.symbol} has reached or exceeded your target of ${alert.targetPrice}. This may be a good time to review your portfolio and consider next steps.
            
            Please assess market conditions carefully and consult your financial advisor before making any decisions.
            
            Thank you for trusting us to keep you informed. If you have any questions, our support team is here to help. Please reply back to the same mail.
            
            Best Regards,
            Bhaswanth Polamarasetti`
          );
          
          alert.status = 'Notified';
          alert.lastNotifiedAt = new Date();
          console.log(`Mail sent to ${alert.email} regarding ${alert.symbol}`);
          await alert.save();
        }
      }
    console.log((new Date()).toLocaleString()); 
  } catch (error) {
    console.error(`Error fetching stock price Cron Job Scheduler:  ${error}`)
  }
});
