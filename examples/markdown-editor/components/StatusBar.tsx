import { Loader2 } from 'npm:lucide-preact@1.17.0';

export default function StatusBar() {
    return (
        <div
            data-show='$status.isVisible'
            class='status-bar'
        >
            <div
                data-show='$status.isLoading'
                class='status-loader'
            >
                <Loader2 class='spin' />
            </div>

            <span data-text='$status.message'></span>
        </div>
    );
}
