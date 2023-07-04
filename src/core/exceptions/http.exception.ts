class HttpException extends Error {
  public static: number;
  public message: string;

  constructor(status: number, message: string) {
    super(message);
    this.static = status;
    this.message = message;
  }
}

export default HttpException;
