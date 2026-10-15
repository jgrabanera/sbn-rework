import { useEffect } from "react";
import Checkbox from "@/Components/Checkbox";
import GuestLayout from "@/Layouts/GuestLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset("password");
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();

        post(route("login"));
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            {status && (
                <div
                    className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
                    role="status"
                >
                    {status}
                </div>
            )}

            <div className="mb-6">
                <h1 className="text-xl font-semibold tracking-tight text-gray-900">
                    Welcome back
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                    Sign in to continue to your account.
                </p>
            </div>

            <form onSubmit={submit} className="space-y-5">
                <div className="space-y-1">
                    <InputLabel
                        htmlFor="email"
                        value="Email"
                        className="text-gray-800"
                    />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="block w-full px-3 py-2"
                        autoComplete="username"
                        isFocused={true}
                        placeholder="you@example.com"
                        onChange={(e) => setData("email", e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="space-y-1">
                    <InputLabel
                        htmlFor="password"
                        value="Password"
                        className="text-gray-800"
                    />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="block w-full px-3 py-2"
                        autoComplete="current-password"
                        placeholder="••••••••"
                        onChange={(e) => setData("password", e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="flex items-center justify-between gap-4">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData("remember", e.target.checked)
                            }
                        />
                        <span className="ms-2 text-sm text-gray-600">
                            Remember me
                        </span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route("password.request")}
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-md"
                        >
                            Forgot password?
                        </Link>
                    )}
                </div>

                <div className="pt-1">
                    <PrimaryButton
                        className="w-full justify-center py-2.5 sm:w-auto sm:min-w-32"
                        disabled={processing}
                    >
                        Log in
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
