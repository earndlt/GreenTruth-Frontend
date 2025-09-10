import { API_ENDPOINTS } from "@/config/api";

// Global API client that automatically includes authentication headers
class ApiClient {
  private baseURL: string;

  constructor() {
    // Extract base URL from API_ENDPOINTS
    this.baseURL = API_ENDPOINTS.BASE_URL || '';
  }

  /**
   * Get authentication token from localStorage
   */
  private getAuthToken(): string | null {
    return localStorage.getItem("greentruth_access_token");
  }

  /**
   * Get default headers including authentication
   */
  private getDefaultHeaders(): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    const token = this.getAuthToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  }

  /**
   * Make authenticated GET request
   */
  async get<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        ...this.getDefaultHeaders(),
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      await this.handleErrorResponse(response);
    }

    return response.json();
  }

  /**
   * Make authenticated POST request
   */
  async post<T>(url: string, data?: any, options?: RequestInit): Promise<T> {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        ...this.getDefaultHeaders(),
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });

    if (!response.ok) {
      await this.handleErrorResponse(response);
    }

    return response.json();
  }

  /**
   * Make authenticated PUT request
   */
  async put<T>(url: string, data?: any, options?: RequestInit): Promise<T> {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        ...this.getDefaultHeaders(),
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });

    if (!response.ok) {
      await this.handleErrorResponse(response);
    }

    return response.json();
  }

  /**
   * Make authenticated DELETE request
   */
  async delete<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        ...this.getDefaultHeaders(),
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      await this.handleErrorResponse(response);
    }

    return response.json();
  }

  /**
   * Handle error responses consistently
   */
  private async handleErrorResponse(response: Response): Promise<never> {
    let errorMessage = `HTTP error! status: ${response.status}`;
    
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch {
      // If response is not JSON, use default error message
    }

    // Handle authentication errors
    if (response.status === 401) {
      // Clear invalid token
      localStorage.removeItem("greentruth_access_token");
      localStorage.removeItem("greentruth_refresh_token");
      
      // Redirect to login page
      window.location.href = "/login";
    }

    throw new Error(errorMessage);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }

  /**
   * Get current user data from localStorage
   */
  getCurrentUser(): any {
    const user = localStorage.getItem("greentruth_user");
    return user ? JSON.parse(user) : null;
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient;