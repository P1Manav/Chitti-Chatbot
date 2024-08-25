import { NextFunction, Request, Response } from "express";
import User from "../models/User.js";
import { configureOpenAI } from "../config/openai-config.js";
import { OpenAIApi, ChatCompletionRequestMessage } from "openai";

export const generateChatCompletion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { message } = req.body;
  try {
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(401).json({ message: "Invalid token or user not found" });
    }

    const chats = user.chats.map(({ role, content }) => ({
      role,
      content,
    })) as ChatCompletionRequestMessage[];
    chats.push({ content: message, role: "user" });

    const config = configureOpenAI();
    const openai = new OpenAIApi(config);

    const chatResponse = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: chats,
    });

    // Check for valid response
    if (!chatResponse.data.choices || chatResponse.data.choices.length === 0) {
      throw new Error("No choices returned from OpenAI API");
    }

    const newMessage = chatResponse.data.choices[0].message;
    if (!newMessage) {
      throw new Error("Message from OpenAI API is undefined");
    }

    user.chats.push({ content: message, role: "user" });
    user.chats.push(newMessage);
    await user.save();

    return res.status(200).json({ chats: user.chats });
  } catch (error) {
    console.error("Error in generateChatCompletion:", error.stack || error);
    return res.status(500).json({ message: "Something went wrong", cause: error.message });
  }
};

export const sendChatsToUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(401).send("Invalid token or user not found");
    }

    return res.status(200).json({ message: "OK", chats: user.chats });
  } catch (error) {
    console.error("Error in sendChatsToUser:", error.stack || error);
    return res.status(500).json({ message: "ERROR", cause: error.message });
  }
};

export const deleteChats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(401).send("Invalid token or user not found");
    }

    // Correctly clear chats
    user.chats.splice(0, user.chats.length); // This will empty the array while preserving the DocumentArray type
    await user.save();

    return res.status(200).json({ message: "OK" });
  } catch (error) {
    console.error("Error in deleteChats:", error.stack || error);
    return res.status(500).json({ message: "ERROR", cause: error.message });
  }
};
