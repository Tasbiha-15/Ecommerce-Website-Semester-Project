
export default function ProductManagement() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-slate-500" /></div>}>
            <ProductManagementContent />
        </Suspense>
    )
}
