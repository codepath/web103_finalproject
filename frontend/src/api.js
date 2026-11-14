
// ==========================================
// ANIMATED CHEF EVENTS
// ==========================================

export function chefEvent(type, detail = {}) {
  window.dispatchEvent(
    new CustomEvent("prepwise:chef", {
      detail: {
        type,
        ...detail,
      },
    })
  );
}

// ==========================================
// API REQUEST HELPER
// ==========================================

async function request(path, options = {}) {
  const method = options.method || "GET";

  const response = await fetch(
    `/api${path}`,

    {
      ...options,

      credentials: "same-origin",

      headers: {
        "Content-Type": "application/json",

        "X-PrepWise-Request": "1",

        ...options.headers,
      },

      body:
        options.body === undefined

          ? undefined

          : JSON.stringify(options.body),
    }
  );

  const data =
    response.status === 204

      ? null

      : await response.json().catch(() => ({}));

  // Handle expired login sessions.

  if (!response.ok) {
    if (
      response.status === 401 &&
      !path.startsWith("/auth/")
    ) {
      window.dispatchEvent(
        new Event("prepwise:session-expired")
      );
    }

    throw new Error(
      data?.error ||
      `Request failed (${response.status})`
    );
  }

  // ========================================
  // NOTIFY THE CHEF ABOUT PANTRY CHANGES
  // ========================================

  if (method !== "GET") {

    if (
      path.startsWith("/pantry-items") ||

      [
        "/kitchen/cook",

        "/kitchen/waste",

        "/shopping-list/checked/to-pantry",

      ].includes(path)
    ) {
      chefEvent("pantry-updated");
    }

    // Celebrate successful application actions.

    const celebrations = {

      "/saved-recipes":
        "Recipe saved!",

      "/meal-plan":
        "Meal planned!",

      "/shopping-list/generate":
        "Shopping list ready!",

      "/kitchen/cook":
        "Meal cooked! Great job, Chef!",
    };

    if (
      method === "POST" &&

      celebrations[path] &&

      !data?.alreadyRecorded
    ) {
      chefEvent("celebrate", {
        message: celebrations[path],
      });
    }

    if (
      method === "POST" &&

      path === "/chat/weekly-plan" &&

      Number(data?.added) > 0
    ) {
      chefEvent("celebrate", {
        message: "Weekly plan saved!",
      });
    }
  }

  return data;
}

// ==========================================
// API METHODS
// ==========================================

export const api = {

  get(path) {
    return request(path);
  },

  post(path, body) {
    return request(path, {
      method: "POST",

      body: body ?? {},
    });
  },

  patch(path, body) {
    return request(path, {
      method: "PATCH",

      body,
    });
  },

  del(path) {
    return request(path, {
      method: "DELETE",
    });
  },
};

// ==========================================
// GET RECIPES
// ==========================================

export function getRecipes(params = {}) {

  const query = new URLSearchParams(
    Object.entries(params).filter(
      ([, value]) =>
        value !== "" &&
        value != null
    )
  ).toString();

  return api.get(
    query

      ? `/recipes?${query}`

      : "/recipes"
  );
}

// ==========================================
// GET A RECIPE AND NOTIFY THE CHEF
// ==========================================

export async function getRecipe(id) {

  const recipe = await api.get(
    `/recipes/${id}`
  );

  chefEvent("recipe-viewed", {
    recipe,
  });

  return recipe;
}
