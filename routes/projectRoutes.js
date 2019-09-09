const express = require('express')
const router = express.Router();

const projectModel = require('../data/helpers/projectModel')
const actionModel = require('../data/helpers/actionModel')
const mappers = require('../data/helpers/mappers')


// get all projects

router.get('/', (req, res) => {
  projectModel.get()
    .then(projects => res.status(200).json(projects))
    .catch(err => {
      res.status(500).json({ error: "The projects could not be retrieved from the server" })
    })
})


//get projects by id

router.get('/:id', (req, res) => {
  const id = req.params.id
  projectModel.get(id)
    .then(projects => {
      if (projects) {
        res.status(200).json(projects)
      } else {
        res.status(404).json({ message: "The project with the id provided does not exist" })
      }
    })
})

// create new project
router.post('/', (req, res) => {
  const { name, description } = req.body;
  if (!name || !description) {
    return res.status(400).json({ error: "Please provide a name and description for this project" })
  }
  projectModel.insert({ name, description })
    .then(project => {
      res.status(201).json(project)
    })
    .catch(err => {
      res.status(500).json({ error: "There was an error saving this project" })
    })
})

//delete project
router.delete('/:id', (req, res) => {
  const id = req.params.id
  projectModel.remove(id)
    .then(deleted => {
      if (deleted) {
        res.status(204).end()
      } else {
        res.status(404).json({ error: "The project with the id provided does not exist" })
      }
    })
    .catch(err => {
      res.status(500).json({ error: "The project could not be removed from the server" })
    })
})

//update project
router.put('/:id', (req, res) => {
  const id = req.params.id
  const { name, description } = req.body
  if (!name || !description) {
    return res.status(400).json({ error: "Please provide the name and description for the project" })
  }
  projectModel.update(id, { name, description })
    .then(projectUpdated => {
      if (projectUpdated) {
        projectModel.get(id)
          .then(project => {
            res.status(201).json(project)
          })
      } else {
        res.status(404).json({ error: "The project with the id provided does not exist" })
      }
    })
    .catch(err => {
      res.status(500).json({ error: "The project could not be updated" })
    })
})



module.exports = router;