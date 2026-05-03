import ListRecipe from "../components/ListRecipe";
import { useMyRecipes } from "../hook/useRecipesQuery";
import AiRecipe from "../components/AiRecipe";

function MyCookbook() {
  const { data: savedRecipes = [] } = useMyRecipes();

  return (
    <>
      <AiRecipe />
      <ListRecipe
        title="Sổ tay của tôi"
        description="Sổ tay của bạn"
        recipes={savedRecipes}
        showAddButton={true}
      />
    </>
  );
}

export default MyCookbook;
