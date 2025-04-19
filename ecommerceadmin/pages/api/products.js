import { mongooseConnect } from '@/lib/mongoose';
import { Product } from '@/models/Product';

export default async function handler(req, res) {
  try {
    await mongooseConnect();

    switch (req.method) {
      case 'GET':
        if (req.query?.id) {
          const product = await Product.findById(req.query.id);
          return product 
            ? res.json(product)
            : res.status(404).json({ error: 'Product not found' });
        } else {
          const products = await Product.find().sort({ createdAt: -1 });
          return res.json(products);
        }

        case 'POST': {
          const { title, description, price, images = [] } = req.body; // Default images to []
          if (!title || price === undefined || isNaN(price)) {
            return res.status(400).json({ error: 'Valid title and price are required' });
          }
          try {
            const productDoc = await Product.create({
              title,
              description: description || '',
              price: Number(price),
              images
            });
            return res.status(201).json(productDoc);
          } catch (err) {
            console.error('Create error:', err);
            return res.status(500).json({ 
              error: 'Create failed',
              details: err.message 
            });
          }
        }

      case 'PUT': {
        const { images: productImages, _id, ...updateData } = req.body;
        if (!_id) {
          return res.status(400).json({ error: 'Product ID is required' });
        }
        const updatedProduct = await Product.findByIdAndUpdate(
          _id,
          { ...updateData, images: productImages },
          { new: true, runValidators: true }
        );
        return updatedProduct
          ? res.json(updatedProduct)
          : res.status(404).json({ error: 'Product not found' });
      }

      case 'DELETE':
        if (!req.query?.id) {
          return res.status(400).json({ error: 'Product ID is required' });
        }
        const deletedProduct = await Product.findByIdAndDelete(req.query.id);
        return deletedProduct
          ? res.json({ message: 'Product deleted successfully' })
          : res.status(404).json({ error: 'Product not found' });

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).json({ message: `Method ${req.method} not allowed` });
    }

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      error: 'Server error',
      message: error.message,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
  }
}