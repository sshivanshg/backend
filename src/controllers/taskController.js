const prisma = require('../models/prismaClient')

exports.createTask = async (req, res)=>{
    const {title, description, projectId} = req.body
    if (!title || !description || !projectId) return res.status(400).send({error: "Invalid fields"})
    
    try{
        const existingProject = await prisma.project.findUnique({where:{id:projectId}})
        if (!existingProject) return res.status(400).send({error: `Project with id ${projectId} does not exist`})
        const task = await prisma.task.create({
            data:{
                title,
                description,
                projectId 
            }
        })
        res.status(201).send({message:"Task created successfully", task})
} catch (error){
    res.status(500).send({error: "Something went wrong"})
}

};

exports.deleteTask = async (req, res) => {
    const { id } = req.params
    if (!id) return res.status(400).send({error: "Task ID is required"})
    try{
        const existingTask = await prisma.task.findUnique({where:{id:parseInt(id)}})
        if (!existingTask) return res.status(400).send({error: "Task does not exist"})
        await prisma.task.delete({
            where:{id:parseInt(id)}
    })
    res.status(200).send({message: `Task with id ${id} deleted successfully`})
} catch (error){
    res.status(500).send({error: "Something went wrong"})
}
}

exports.updateTask = async (req, res) => {
    const { id } = req.params
    const {title, description, isCompleted, inProgress} = req.body

    // if (!id || (!title || !description || !isCompleted || !inProgress)) return res.status(400).send({error: "Task id and atleast one field is required."})

    try{
        const existingTask = await prisma.task.findUnique({where: {id: parseInt(id)}})
        if (!existingTask) return res.status(400).send({error: `Task with id ${id} does not exist`})
        const updatedTask = await prisma.task.update({
            where:{
                id: parseInt(id)
            },
            data:{
                title: title || existingTask.title,
                description: description || existingTask.description,
                isCompleted:isCompleted || existingTask.isCompleted,
                inProgress:inProgress || existingTask.inProgress
            }
        })
        console.log('updated',isCompleted)
        res.status(200).send({message: `Task with id ${id} updated successfully`, updatedTask})

    }catch (error){
        res.status(500).send({error: "Something went wrong"})
    }
}

exports.getTask = async (req, res) => {
    const { id } = req.params
    if (!id) return res.status(400).send({error: "Task id required"})
    try{
        const existingTask = await prisma.task.findUnique({where: {id: parseInt(id)}})
        if (!existingTask) return res.status(400).send({error: `Task with ID ${id} does not exist`})
        return res.status(201).send(existingTask)
} catch (error){
    return res.status(500).send({error: "Something went wrong"})
}
}

exports.getAllTasks = async (req, res) => {
    try {
      const tasks = await prisma.task.findMany();
  
      res.status(200).send({ tasks });
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "Something went wrong" });
    }
  };


exports.getTasksByProject = async (req, res) => {
    const { projectId } = req.params;
    try {
        
        const tasks = await prisma.task.findMany({
        where: {
            projectId: parseInt(projectId) 
        },
        include: {
            project: true 
        }
        });

        if (tasks.length === 0) {
        return res.status(404).send({ message: `No tasks found for project with id ${projectId}` });
        }

        res.status(200).send({ tasks });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Something went wrong" });
    }
};
