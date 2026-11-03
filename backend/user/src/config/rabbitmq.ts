
import amqp from "amqplib"

let channel:amqp.Channel

export const connectRabbitMQ=async()=>{
    try {
        const connection=await amqp.connect({
            protocol:'amqp',
            hostname:process.env.Rabbitmq_Host as string,
            port:5672,
            username:process.env.Rabbitmq_Username as string,
            password:process.env.Rabbitmq_Password as string

        })
        channel=await connection.createChannel()
        console.log("connected to rabbit mq✅");
        
    } catch (error) {
        console.log("error failed to connect",error);
        
    }
}

export const publishToQueue=async(queueName:string,message:any)=>{
    if (!channel) {
        console.log("Rabbitmq channel is not initalized");
        return
        
    }

    await channel.assertQueue(queueName,{durable:true})

    channel.sendToQueue(queueName,Buffer.from(JSON.stringify(message)),{
        persistent:true
    })
}