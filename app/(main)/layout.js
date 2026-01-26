

export default async function MainLayout({ children }) {
    // checkUser was removed to optimize speed. 
    // It's checked in specific protected pages like /dashboard.

    return (
        <div className="container mx-auto px-4 py-8">
            {children}
        </div>
    );
}
