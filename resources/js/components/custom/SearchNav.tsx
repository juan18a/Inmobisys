

export default function SearchNav() {

    return (
        <>
            {/* Search */}
            < div className="flex items-center bg-surface-container-low rounded-full px-4 py-1.5 gap-2 border border-outline-variant/10" >
                <span className="material-symbols-outlined text-secondary text-sm">search</span>
                <input
                    className="bg-transparent border-none focus:ring-0 text-sm font-label w-48 text-on-surface outline-none"
                    placeholder="Search architecture..."
                    type="text"
                />
            </div >
        </>

    );


}