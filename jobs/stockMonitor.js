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
            `📈 Stock Alert: Action Required for ${alert.symbol}!`, 
            `We hope this message finds you well.\n\nWe are writing to inform you about a significant update regarding one of your monitored stocks.\n\n
              Stock Symbol: ${alert.symbol}\n
              Current Price: ${price}\n
              Target Price: ${alert.targetPrice}\n
              We are thrilled to notify you that the current price of ${alert.symbol} has reached or surpassed your target price of ${alert.targetPrice}. This could be an excellent opportunity to review your portfolio and decide on any potential actions you might wish to take.
              As always, it’s important to assess the market conditions and consult with your financial advisor before making any decisions. Our platform is here to assist you in staying updated and making informed choices.
              Thank you for trusting us to keep you informed about the stocks that matter to you. If you have any questions or need further assistance, please don’t hesitate to reach out to our support team.
              Best Regards,
              Bhaswanth Polamarasetti`
          );
          /*
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
          */
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
