import { Request, Response } from "express"

export const authRouter = (_: Request, res: Response) => {
  res.send("Auth route")
}
