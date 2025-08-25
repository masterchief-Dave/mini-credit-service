export class ApiSuccess<T = any> {
  success: true;
  status_code: number;
  message: string;
  data: T;

  constructor(statusCode: number, message: string, data: T = {} as T) {
    this.success = true as const;
    this.status_code = statusCode;
    this.message = message;
    this.data = data;
  }

  static ok<T = any>(message = "OK", data?: T) {
    return new ApiSuccess<T>(200, message, data ?? ({} as T));
  }
  static created<T = any>(message = "Created", data?: T) {
    return new ApiSuccess<T>(201, message, data ?? ({} as T));
  }
  static accepted<T = any>(message = "Accepted", data?: T) {
    return new ApiSuccess<T>(202, message, data ?? ({} as T));
  }

  static noContent(message = "No content") {
    return new ApiSuccess<null>(204, message, null);
  }
  static resetContent<T = any>(message = "Content reset", data?: T) {
    return new ApiSuccess<T>(205, message, data ?? ({} as T));
  }
}

export class ApiError {
  success: false;
  status_code: number;
  code?: string;
  message: string;
  details?: unknown;

  constructor(
    statusCode: number,
    code: string,
    message: string,
    details?: unknown
  ) {
    this.success = false as const;
    this.status_code = statusCode;
    this.code = code;
    this.message = message;
    this.details = details;
  }

  static badRequest(message = "Bad request", details?: unknown) {
    return new ApiError(400, "BAD_REQUEST", message, details);
  }
  static unauthorized(message = "Unauthorized") {
    return new ApiError(401, "UNAUTHORIZED", message);
  }
  static forbidden(message = "Forbidden") {
    return new ApiError(403, "FORBIDDEN", message);
  }
  static notFound(message = "Not found") {
    return new ApiError(404, "NOT_FOUND", message);
  }
  static conflict(message = "Conflict") {
    return new ApiError(409, "CONFLICT", message);
  }
  static unprocessable(message = "Validation error", details?: unknown) {
    return new ApiError(422, "UNPROCESSABLE_ENTITY", message, details);
  }
  static tooMany(message = "Too many requests") {
    return new ApiError(429, "TOO_MANY_REQUESTS", message);
  }
  static internal(message = "Internal server error", details?: unknown) {
    return new ApiError(500, "INTERNAL_SERVER_ERROR", message, details);
  }
}

export type ApiResponse<T = any> = ApiSuccess<T> | ApiError;
