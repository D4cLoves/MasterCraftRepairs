import './HomePage.css'

export const HomePage = () => {
	return (
		<div className="homepage">
			<img
				src="https://wallpaperaccess.com/full/258875.jpg"
				alt="Anime character"
				className="homepage-image"
				onError={(e) => {
					e.currentTarget.src = 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&q=80'
				}}
			/>
		</div>
	)
}
