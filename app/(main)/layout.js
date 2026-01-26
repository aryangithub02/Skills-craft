/**
 * Layout component that wraps its children in a centered container with horizontal padding and vertical spacing.
 * @param {{children: import('react').ReactNode}} props - Component props.
 * @param {import('react').ReactNode} props.children - Elements to be rendered inside the layout container.
 * @returns {JSX.Element} A div element that serves as the page container and renders `children`.
 */
export default async function MainLayout({ children }) {
    // checkUser was removed to optimize speed. 
    // It's checked in specific protected pages like /dashboard.

    return (
        <div className="container mx-auto px-4 py-8">
            {children}
        </div>
    );
}