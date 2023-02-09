const router = require("express").Router();
const {
  models: { List, TaskCard, Comment, User },
} = require("../db");

// GET /api/lists/:boardId
router.get("/:boardId", async (req, res, next) => {
  try {
    const lists = await List.findAll({
      where: {
        boardId: req.params.boardId,
      },
      order: [["position", "ASC"]],
      include: {
        model: TaskCard,
        separate: true,
        order: [["position", "ASC"]],
        include: {
          model: Comment,
          separate: true,
          order: [["createdAt", "DESC"]],
          include: [User],
        },
      },
    });
    res.status(200).json(lists);
  } catch (err) {
    next(err);
  }
});

// POST /api/lists/:boardId
router.post("/:boardId", async (req, res, next) => {
  try {
    await List.create(req.body);
    const list = await List.findOne({
      where: {
        listName: req.body.listName,
        position: req.body.position,
        boardId: req.body.boardId,
      },
      include: {
        model: TaskCard,
        separate: true,
        order: [["position", "ASC"]],
        include: {
          model: Comment,
          separate: true,
          order: [["createdAt", "DESC"]],
          include: [User],
        },
      },
    });
    res.status(200).json(list);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/lists/thisList/:listId
router.delete("/thisList/:listId", async (req, res, next) => {
  try {
    const deletedList = List.destroy({ where: { id: req.params.listId } });
    res
      .status(201)
      .json({ deletedList: deletedList, message: "List successfully removed" });
  } catch (err) {
    next(err);
  }
});

// PUT /api/lists/:boardId/:listId
router.put("/:boardId/:listId", async (req, res, next) => {
  try {
    const list = await List.findByPk(req.params.listId);
    res.status(200).json(await list.update(req.body));
  } catch (err) {
    next(err);
  }
});

module.exports = router;
