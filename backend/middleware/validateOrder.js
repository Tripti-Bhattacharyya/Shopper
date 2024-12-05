const validateOrderRequest = (req, res, next) => {
    const { userId, orders } = req.body;
  
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
  
    if (!Array.isArray(orders) || orders.length === 0) {
      return res.status(400).json({ message: 'Orders array is required' });
    }
  
    for (const order of orders) {
      if (!order.product || !order.quantity) {
        return res.status(400).json({ message: 'Product and quantity are required' });
      }
    }
  
    next();
  };
  
  export default validateOrderRequest;
  