//src/server/api/routers/food.ts
import { TRPCError } from "@trpc/server";
import axios from 'axios';




interface ApiResponse {
  foods: {
    food_name: string;
    nf_protein: number;
    nf_total_carbohydrate: number;
    nf_total_fat: number;
    serving_weight_grams: number;
  }[];
}


export async function searchFoodInDatabase(query: string) {
  const NUTRIONIX_APP_ID = process.env.NUTRIONIX_APP_ID;
  const NUTRIONIX_APP_KEY = process.env.NUTRIONIX_APP_KEY;

  try {
    const response = await axios.post<ApiResponse>(
      `https://trackapi.nutritionix.com/v2/natural/nutrients`,
      { query, timezone: "US/Western" },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-app-id': NUTRIONIX_APP_ID,
          'x-app-key': NUTRIONIX_APP_KEY,
        },
      }
    );

    if (!response.data || !response.data.foods || response.data.foods.length === 0) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'No search results found' });
    }

    const foodData = response.data.foods[0];

    if (!foodData) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'No food data found' });
    }

    return {
      name: `${foodData.food_name} (${foodData.serving_weight_grams}g)`,
      protein: foodData.nf_protein,
      carbs: foodData.nf_total_carbohydrate,
      fat: foodData.nf_total_fat,
      servingSize: foodData.serving_weight_grams,
    };

  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Food not found' });
    } else {
      console.error(`Error occurred while searching food in the database: ${String(error)}`);
      throw error;
    }
  }
}