import { useNavigate, useParams } from "react-router-dom";
import { useRecipeById } from "./useRecipesQuery";

export const useRecipeDetails = (manualId?: string) => {
  const { id: paramsId } = useParams();
  const id = manualId || paramsId;
  const navigate = useNavigate();

  const { data: recipe, isLoading: loading } = useRecipeById(id || null);

  // unit labels
  const UNIT_LABELS: Record<string, string> = {
    G: "g",
    KG: "kg",
    ML: "ml",
    L: "lít",
    TSP: "muỗng cà phê",
    TBSP: "muỗng canh",
    PCS: "phần",
    OUNCE: "ounce",
    POUND: "pound",
    OTHER: "",
  };

  // back to previous page
  const handleBack = () => {
    navigate(-1);
  };

  return {
    id,
    recipe,
    loading,
    UNIT_LABELS,
    handleBack,
    navigate,
  };
};
