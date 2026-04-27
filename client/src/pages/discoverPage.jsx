import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import '../Pages_css/discoverPage.css';

const DiscoverPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [flowers, setFlowers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [totalFlowers, setTotalFlowers] = useState(0);
    const [hasNextPage, setHasNextPage] = useState(false);

    const searchQuery = searchParams.get('search') || '';
    const currentPage = Number(searchParams.get('page') || 1);
    const selectedColor = searchParams.get('color') || '';
    const selectedBloomMonth = searchParams.get('bloomMonth') || '';
    const selectedSort = searchParams.get('sort') || 'common_name:asc';

    useEffect(() => {
        setIsLoading(true);
        const [sortBy, sortDir] = selectedSort.split(':');
        const params = new URLSearchParams({
            source: 'trefle',
            page: String(currentPage),
            sortBy,
            sortDir: sortDir || 'asc',
        });

        if (searchQuery) params.set('search', searchQuery);
        if (selectedColor) params.set('color', selectedColor);
        if (selectedBloomMonth) params.set('bloomMonth', selectedBloomMonth);

        fetch(`/api/flowers?${params.toString()}`)
            .then(res => res.json())
            .then(data => {
                setFlowers(Array.isArray(data.data) ? data.data : []);
                setTotalFlowers(data?.meta?.total || 0);
                setHasNextPage(Boolean(data?.links?.next));
            })
            .catch(err => console.error('Error fetching flowers:', err))
            .finally(() => setIsLoading(false));
    }, [searchQuery, currentPage, selectedColor, selectedBloomMonth, selectedSort]);

    const updateParam = (key, value) => {
        const nextParams = new URLSearchParams(searchParams);
        if (value) {
            nextParams.set(key, value);
        } else {
            nextParams.delete(key);
        }
        nextParams.set('page', '1');
        setSearchParams(nextParams);
    };

    const goToPage = (page) => {
        const nextParams = new URLSearchParams(searchParams);
        nextParams.set('page', String(Math.max(1, page)));
        setSearchParams(nextParams);
    };

    return (
        <main className="discover-page">
            <h1 className="discover-title">
                {searchQuery ? `Results for "${searchQuery}"` : 'Discover Flowers'}
            </h1>
            {!isLoading && totalFlowers > 0 && (
                <p className="discover-status">{totalFlowers} flowers found</p>
            )}

            <div className="discover-filters">
                <label>
                    Color:
                    <select
                        value={selectedColor}
                        onChange={(e) => updateParam('color', e.target.value)}
                    >
                        <option value="">Any</option>
                        <option value="red">Red</option>
                        <option value="white">White</option>
                        <option value="yellow">Yellow</option>
                        <option value="pink">Pink</option>
                        <option value="purple">Purple</option>
                    </select>
                </label>

                <label>
                    Bloom Month:
                    <select
                        value={selectedBloomMonth}
                        onChange={(e) => updateParam('bloomMonth', e.target.value)}
                    >
                        <option value="">Any</option>
                        <option value="jan">January</option>
                        <option value="apr">April</option>
                        <option value="jun">June</option>
                        <option value="sep">September</option>
                        <option value="dec">December</option>
                    </select>
                </label>

                <label>
                    Sort:
                    <select
                        value={selectedSort}
                        onChange={(e) => updateParam('sort', e.target.value)}
                    >
                        <option value="common_name:asc">Name (A-Z)</option>
                        <option value="common_name:desc">Name (Z-A)</option>
                        <option value="images_count:desc">Most Photographed</option>
                        <option value="updated_at:desc">Recently Added</option>
                    </select>
                </label>
            </div>

            {isLoading && <p className="discover-status">Loading flowers...</p>}

            {!isLoading && flowers.length === 0 && (
                <p className="discover-status">No flowers found.</p>
            )}

            <div className="flower-grid">
                {flowers.map(flower => (
                    <Link
                        key={flower.id}
                        to={`/discover/${flower.id}`}
                        className="flower-card"
                    >
                        <div className="flower-card-image">
                            {flower.image_url ? (
                                <img src={flower.image_url} alt={flower.name} />
                            ) : (
                                <span className="flower-card-placeholder" aria-hidden="true">🌸</span>
                            )}
                        </div>
                        <div className="flower-card-info">
                            <h2 className="flower-card-name">{flower.name}</h2>
                            {flower.flower_family && (
                                <p className="flower-card-family">{flower.flower_family}</p>
                            )}
                            {flower.flower_meaning && (
                                <p className="flower-card-meaning">{flower.flower_meaning}</p>
                            )}
                        </div>
                    </Link>
                ))}
            </div>

            {flowers.length > 0 && (
                <div className="pagination">
                    <button
                        className="pagination-btn"
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        ← Prev
                    </button>
                    <span className="pagination-info">
                        Page {currentPage}
                    </span>
                    <button
                        className="pagination-btn"
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={!hasNextPage}
                    >
                        Next →
                    </button>
                </div>
            )}
        </main>
    );
};

export default DiscoverPage;
