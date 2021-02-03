import BaseController from './base';
import Room from '../models/room';

class RoomController extends BaseController {
  model = Room;

  getRooms = async (req, res) => {
    try {
      let maxPrice = req.query.maxPrice;
      let minSurface = req.query.minSurface;
      let maxSurface = req.query.maxSurface;
      let tags = req.query.tagChips;

      let query = {}

      if (maxPrice) {
        query["price"] = { $lt: maxPrice };
      }

      let surfaceQuery = {};
      if (minSurface) {
        surfaceQuery["$gte"] = minSurface;
      }

      if (maxSurface) {
        surfaceQuery["$lte"] = maxSurface;
      }

      if (minSurface || maxSurface) {
        query['surface'] = surfaceQuery;
      }

      if (tags) {
        query["tags"] = { $in: tags};
      }

      const docs = await this.model.find(query);
      res.status(200).json(docs);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }
}

export default RoomController;
