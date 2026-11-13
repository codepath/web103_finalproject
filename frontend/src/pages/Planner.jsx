import { useState, useEffect, useRef } from "react"; 
import Modal from "../components/Modal";
import RecipeDetail from "../components/RecipeDetail";
import { getRecipes, getRecipe, getMealPlan, addMealPlanEntry, deleteMealPlanEntry, updateMealPlanEntry } from "../api"; 
import { Link } from "react-router-dom"
import "../styles/planner.css";

const MEAL_TYPES = ["breakfast", "lunch", "dinner", "snack"];

// Find Monday of the current week 
function getWeekStart(date) {
    const monday = new Date(date); 
    const day = monday.getDay(); 

    const daysSinceMonday = (day + 6) % 7; 
    monday.setDate(monday.getDate() - daysSinceMonday); 
    return monday; 
}

// Format date as YYYY-MM-DD
function formatDate(date) {
    const year = date.getFullYear(); 
    const month = String(date.getMonth() + 1).padStart(2, "0"); 
    const day = String(date.getDate()).padStart(2, "0"); 

    return `${year}-${month}-${day}`;
}

export default function Planner() {
    const [weekStart, setWeekStart] = useState(() => 
        getWeekStart(new Date())
    );

    // Recipe selection state
    const [selectedSlot, setSelectedSlot] = useState(null); 
    const [recipes, setRecipes] = useState([]);
    const [recipesLoading, setRecipesLoading] = useState(false);
    const [recipesError, setRecipesError] = useState("");

    // Recipe detail state
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [recipeDetails, setRecipeDetails] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [detailError, setDetailError] = useState("");

    // Meal plan state
    const [meals, setMeals] = useState([]);
    const [mealsLoading, setMealsLoading] = useState(false);
    const [mealsError, setMealsError] = useState("");
    const [savingMealId, setSavingMealId] = useState(null);

    // Calendar scroll state and controls
    const calendarScrollRef = useRef(null);
    const [openMealMenuId, setOpenMealMenuId] = useState(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);
    const [visibleDays, setVisibleDays] = useState("");

    function updateCalendarScroll() {
        const element = calendarScrollRef.current;
        if (!element) return;

        const { scrollLeft, scrollWidth, clientWidth } = element;

        setCanScrollLeft(scrollLeft > 2);
        setCanScrollRight(
            scrollLeft + clientWidth < scrollWidth - 2
        );

        const firstColumn = element.querySelector(".planner-day");
        if (!firstColumn) return;

        const columnWidth =
            firstColumn.getBoundingClientRect().width + 14;

        const firstIndex = Math.min(
            6,
            Math.floor(scrollLeft / columnWidth)
        );

        const lastIndex = Math.min(
            6,
            Math.floor(
                (scrollLeft + clientWidth - 1) / columnWidth
            )
        );

        const names = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

        setVisibleDays(
            `${names[firstIndex]} – ${names[lastIndex]} in view`
        );
    }

    function scrollCalendar(direction) {
        const element = calendarScrollRef.current;
        if (!element) return;

        const firstColumn = element.querySelector(".planner-day");
        if (!firstColumn) return;

        const gap = parseFloat(getComputedStyle(element.firstElementChild).columnGap) || 14;
        const distance = firstColumn.getBoundingClientRect().width + gap;

        element.scrollBy({
            left: direction * distance,
            behavior: "smooth",
        });
    }

    const weekDays = Array.from({ length: 7 }, (_, index) => {
        const date = new Date(weekStart);
        date.setDate(weekStart.getDate() + index);
        return date;
    });

    function changeWeek(amount) {
        setWeekStart((current) => {
            const next = new Date(current); 
            next.setDate(next.getDate() + amount * 7); 
            return next; 
        }); 
    }
    
    // Format the selected week's date range
    const weekEnd = weekDays[6];

    const startMonth = weekStart.toLocaleDateString("en-US", {
        month: "long",
    });

    const endMonth = weekEnd.toLocaleDateString("en-US", {
        month: "long",
    });

    const weekRange =
        weekStart.getMonth() === weekEnd.getMonth() &&
        weekStart.getFullYear() === weekEnd.getFullYear()
            ? `${startMonth} ${weekStart.getDate()} – ${weekEnd.getDate()}, ${weekEnd.getFullYear()}`
            : `${startMonth} ${weekStart.getDate()}, ${weekStart.getFullYear()} – ${endMonth} ${weekEnd.getDate()}, ${weekEnd.getFullYear()}`;


    // Add a selected recipe to the meal 
    async function handleAddMeal(recipeId) {
        try {
            const newMeal = await addMealPlanEntry({
                recipe_id: recipeId, 
                planned_date: selectedSlot.planned_date,
                meal_type: selectedSlot.meal_type,
            });

            setMeals((current) => [...current, newMeal]); 
            setSelectedSlot(null);
        } catch (error) {
            setRecipesError(error.message);
        }
    }

    // Delete a planned meal
    async function handleDeleteMeal(mealId) {
        if (savingMealId !== null) return;

        setSavingMealId(mealId);
        setMealsError("");

        try {
            await deleteMealPlanEntry(mealId);

            setMeals((current) =>
                current.filter((meal) => meal.id !== mealId)
            );
        } catch (error) {
            setMealsError(
                `Couldn't remove the meal: ${error.message}`
            );
        } finally {
            setSavingMealId(null);
        }
    }

    // Update a planned meal
    async function handleUpdateMeal(mealId, updatedMeal) {
        if (savingMealId !== null) return;

        // Close the dropdown immediately after selecting a change
        setOpenMealMenuId(null);

        setSavingMealId(mealId);
        setMealsError("");

        try {
            const updated = await updateMealPlanEntry(
                mealId,
                updatedMeal
            );

            console.log("Meal updated successfully:", updated);

            setMeals((current) =>
                current.map((meal) =>
                    meal.id === mealId
                        ? { ...meal, ...updated }
                        : meal
                )
            );
        } catch (error) {
            console.error("Failed to update meal:", error);

            setMealsError(
                `Couldn't save your changes: ${error.message}`
            );
        } finally {
            setSavingMealId(null);
        }
    }


    useEffect(() => {
        if (!selectedSlot) return; 

        let ignore = false; 

        async function loadRecipes() {
            setRecipesLoading(true);
            setRecipesError("");

            try {
                const data = await getRecipes();

                if (!ignore) {
                    setRecipes(data);
                }
            } catch (error) {
                if (!ignore) {
                    setRecipesError(error.message);
                }
            } finally {
                if (!ignore) {
                    setRecipesLoading(false); 
                }
            }
        }
        loadRecipes(); 

        return () => {
            ignore = true;
        };
    }, [selectedSlot])


    // Fetch planned meals whenever the selected week changes
    useEffect(() => {
        let ignore = false;

        async function loadMeals() {
        setMealsLoading(true);
        setMealsError("");

        try {
            const data = await getMealPlan(formatDate(weekStart));

            if (!ignore) {
            setMeals(data);
            }
        } catch (error) {
            if (!ignore) {
            setMealsError(error.message);
            }
        } finally {
            if (!ignore) {
            setMealsLoading(false);
            }
        }
        }

        loadMeals();

        return () => {
        ignore = true;
        };
    }, [weekStart]);


    // Fetch full details when a planned recipe is selected
    useEffect(() => {
        if (!selectedRecipe) return;

        let ignore = false;

        async function loadRecipeDetails() {
            setDetailLoading(true);
            setDetailError("");
            setRecipeDetails(null);

            try {
                const data = await getRecipe(selectedRecipe.recipe_id);

                if (!ignore) {
                    setRecipeDetails(data);
                }
            } catch (error) {
                if (!ignore) {
                    setDetailError(error.message);
                }
            } finally {
                if (!ignore) {
                    setDetailLoading(false);
                }
            }
        }

        loadRecipeDetails();

        return () => {
            ignore = true;
        };
    }, [selectedRecipe]);


    useEffect(() => {
        const element = calendarScrollRef.current;
        if (!element) return;

        const observer = new ResizeObserver(updateCalendarScroll);

        observer.observe(element);

        const grid = element.querySelector(".planner-grid");
        if (grid) observer.observe(grid);

        updateCalendarScroll();

        return () => observer.disconnect();
    }, []);


    return (
        <main>
        <header className="planner-header">
            <div className="planner-header-top">
                <div>
                    <h1>Meal Planner</h1>
                    <p>Make room for a delicious week.</p>
                </div>

                <div className="planner-header-actions">
                    <Link to="/recipes" className="btn">
                        My Recipes
                    </Link>

                    <Link to="/shopping" className="btn primary">
                        Shopping List
                    </Link>
                </div>
            </div>
        </header>

        <div className="planner-navigation">
            <button
                type="button"
                className="btn planner-arrow"
                onClick={() => changeWeek(-1)}
                aria-label="Previous week"
            >
                ←
            </button>

            <h2 className="planner-week-range">{weekRange}</h2>

            <button
                type="button"
                className="btn planner-arrow"
                onClick={() => changeWeek(1)}
                aria-label="Next week"
            >
                →
            </button>

            <button
                type="button"
                className="btn planner-today"
                onClick={() => setWeekStart(getWeekStart(new Date()))}
            >
                This week
            </button>
        </div>


            {mealsLoading && <p>Loading planned meals...</p>}
            {mealsError && (
                <div className="planner-error" role="alert">
                    <div className="planner-error-content">
                        <span className="planner-error-icon">!</span>
                        <div>
                            <strong>Something went wrong</strong>
                            <p>{mealsError}</p>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="planner-error-close"
                        onClick={() => setMealsError("")}
                        aria-label="Dismiss error"
                    >
                        ×
                    </button>
                </div>
            )}
            
            {/* Calendar scroll controls */}
            <div className="planner-scroll-toolbar">
                <span className="planner-scroll-hint">
                    Scroll to see the full week →
                </span>

                <div className="planner-scroll-controls">
                    <span className="planner-visible-days">
                        {visibleDays}
                    </span>

                    <button
                        type="button"
                        className="planner-scroll-arrow"
                        onClick={() => scrollCalendar(-1)}
                        disabled={!canScrollLeft}
                        aria-label="Scroll calendar left"
                    >
                        ←
                    </button>

                    <button
                        type="button"
                        className="planner-scroll-arrow"
                        onClick={() => scrollCalendar(1)}
                        disabled={!canScrollRight}
                        aria-label="Scroll calendar right"
                    >
                        →
                    </button>
                </div>
            </div>

            {/* Scrollable calendar */}
            <div
                className={`planner-scroll-container ${
                    canScrollRight ? "has-more-right" : ""
                }`}
            >

                <div
                    className="planner-scroll"
                    ref={calendarScrollRef}
                    onScroll={updateCalendarScroll}
                >

                <div className="planner-grid">
                    {weekDays.map((date) => (
                        <div key={formatDate(date)} className="planner-day">
                                                
                        <div className="planner-day-heading">
                            <h2>
                                {date.toLocaleDateString("en-US", {
                                    weekday: "long",
                                })}
                            </h2>

                            <div className="planner-day-date">
                                <span className="planner-day-number">
                                    {date.getDate()}
                                </span>

                                <span className="planner-day-month">
                                    {date.toLocaleDateString("en-US", {
                                        month: "short",
                                    })}
                                </span>
                            </div>
                        </div>

                        <div className ="planner-meals">
                            {MEAL_TYPES.map((mealType) => {
                                const slotMeals = meals.filter(
                                (meal) => 
                                        meal.planned_date === formatDate(date) &&
                                    meal.meal_type === mealType
                                );
                                
                                return (
                                    <div
                                        key={mealType}
                                        className={`planner-meal-slot ${
                                            slotMeals.length > 0 ? `has-meal ${mealType}` : ""
                                        }`}
                                    >
                                    <h3>
                                        {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
                                    </h3>

                                    {slotMeals.map((meal) => (
                                        <div key={meal.id} className="planner-planned-meal">
                                            <button
                                                type="button"
                                                onClick={() => setSelectedRecipe(meal)}
                                            >
                                                {meal.title}
                                            </button>

                                            {meal.prep_minutes != null && (
                                                <p className="planner-meal-time">
                                                    {meal.prep_minutes} min prep
                                                </p>
                                            )}

                                            {savingMealId === meal.id && (
                                                <p className="planner-saving" role="status">
                                                    Saving...
                                                </p>
                                            )}                                            
                                                
                                            <div className="planner-meal-menu">
                                            
                                            <button
                                                type="button"
                                                className="planner-menu-trigger"
                                                aria-label={`Options for ${meal.title}`}
                                                aria-expanded={openMealMenuId === meal.id}
                                                onClick={() => {
                                                    setOpenMealMenuId((current) =>
                                                        current === meal.id ? null : meal.id
                                                    );
                                                }}
                                            >
                                                ...
                                            </button>
                                            
                                            {openMealMenuId === meal.id && (
                                            <div className="planner-meal-menu-content">
                                                <details className="planner-menu-action">
                                                    <summary>
                                                        <span>▦</span> Move to another day
                                                    </summary>
                                                    <input
                                                        type="date"
                                                        disabled={savingMealId !== null}
                                                        value={meal.planned_date}
                                                        onChange={(event) =>
                                                            handleUpdateMeal(meal.id, {
                                                                planned_date: event.target.value,
                                                            })
                                                        }
                                                    />
                                                </details>

                                                    <details className="planner-menu-action">
                                                        <summary>
                                                            <span>🍴</span> Change meal type
                                                        </summary>
                                                        <select
                                                            value={meal.meal_type}
                                                            disabled={savingMealId !== null}
                                                            onChange={(event) =>
                                                                handleUpdateMeal(meal.id, {
                                                                    meal_type: event.target.value,
                                                                })
                                                            }
                                                        >
                                                            {MEAL_TYPES.map((type) => (
                                                                <option key={type} value={type}>
                                                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </details>

                                                    <button
                                                        type="button"
                                                        className="planner-menu-delete"
                                                        onClick={() => handleDeleteMeal(meal.id)}
                                                    >
                                                        <span>×</span> Remove from plan
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                <button 
                                    type="button"
                                    onClick={() => 
                                        setSelectedSlot({
                                            planned_date: formatDate(date),
                                            meal_type: mealType,
                                        })
                                    }
                                >
                                    + Add Meal
                                </button>                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    </div>
    </div>
        <div className="planner-scroll-footer">
            <span>Scroll or swipe sideways to explore all 7 days.</span>
            <span>7 days · 4 meal types</span>
        </div>

            {selectedSlot && (
                <Modal
                    title="Add Meal"
                    onClose={() => setSelectedSlot(null)}
                    wide
                >
                    <h2>Add Meal</h2>

                    <p>
                        Choose a recipe for {selectedSlot.meal_type} on{" "}
                        {selectedSlot.planned_date}.
                    </p>

                    {recipesLoading ? (
                        <p>Loading recipes...</p>
                    ) : recipesError ? (
                        <p role="alert">{recipesError}</p>
                    ) : recipes.length === 0 ? (
                        <p>No recipes found.</p>
                    ) : (
                        <div className="planner-recipe-list">
                            {recipes.map((recipe) => (
                                <div key={recipe.id} className="planner-recipe-option">
                                    <span>{recipe.title}</span>

                                    <button 
                                        type="button"
                                        onClick={() => handleAddMeal(recipe.id)}
                                    >
                                        Add to Plan
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </Modal>
            )}

            {selectedRecipe && (
                <Modal
                    title={selectedRecipe.title}
                    onClose={() => setSelectedRecipe(null)}
                    wide
                >
                    {detailLoading ? (
                        <p>Loading recipe...</p>
                    ) : detailError ? (
                        <p role="alert">{detailError}</p>
                    ) : recipeDetails ? (
                        <RecipeDetail recipe={recipeDetails} />
                    ) : null}
                </Modal>
            )}
        </main>
    );
}