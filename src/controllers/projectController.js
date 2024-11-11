const prisma = require('../models/prismaClient');
const { use } = require('../routes/projectRoutes');
const jwt = require('jsonwebtoken');

exports.createProject = async (req, res) => {
  const { name, description } = req.body;
  const userId = req.userId;

  try {
    const project = await prisma.project.create({
      data: {
        name,
        description,
        ownerId: userId,
      },
    });

    res.status(201).json({ message: 'Project created successfully', project });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteProject = async (req, res) => {
    const { id } = req.params
    if (!id) return res.status(400).send({error: "project ID is required"})
    try{
        const existingproject = await prisma.project.findUnique({where:{id:parseInt(id)}})
        if (!existingproject) return res.status(400).send({error: "project does not exist"})
        await prisma.task.deleteMany({
          where: { projectId: parseInt(id) }
      });
        await prisma.project.delete({
            where:{id:parseInt(id)}
    })
    res.status(200).send({message: `project with id ${id} deleted successfully`})
} catch (error){
    console.log(error)
    res.status(500).send({error: "Something went wrong"})
}
}

exports.updateproject = async (req, res) => {
    const { id } = req.params
    const {title, description} = req.body

    if (!id || (!title && !description)) return res.status(400).send({error: "project id and atleast one field is required."})

    try{
        const existingproject = await prisma.project.findUnique({where: {id: parseInt(id)}})
        if (!existingproject) return res.status(400).send({error: `project with id ${id} does not exist`})
        const updatedproject = await prisma.project.update({
            where:{
                id: parseInt(id)
            },
            data:{
                title: title || existingproject.title,
                description: description || existingproject.description
            }
        })
        res.status(200).send({message: `project with id ${id} updated successfully`, updatedproject})

    }catch (error){
        res.status(500).send({error: "Something went wrong"})
    }
}

exports.getproject = async (req, res) => {
    const { id } = req.params
    if (!id) return res.status(400).send({error: "project id required"})
    try{
        const existingproject = await prisma.project.findUnique({where: {id: parseInt(id)}})
        if (!existingproject) return res.status(400).send({error: `project with ID ${id} does not exist`})
        return res.status(201).send(existingproject)
} catch (error){
    return res.status(500).send({error: "Something went wrong"})
}
}

exports.getAllprojects = async (req, res) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
          return res.status(401).send({ message: 'Unauthorized' });
        }
      console.log("ye dekho token",token)
      const decoded = jwt.verify(token, process.env.JWT_SECRET); 
      const userId = decoded.userId;

      const projects = await prisma.project.findMany({
        where:{ownerId:userId}
      });
  
      res.status(200).send({ projects });
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "Something went wrong" });
    }
  };

