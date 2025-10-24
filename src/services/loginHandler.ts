interface LoginHandlerOptions {
  endpoint?: string;
  onSuccess?: (data: any) => void;
  onError?: (err: unknown) => void;
}

export function attachLoginHandler(
  form: HTMLFormElement,
  options: LoginHandlerOptions = {}
) {
  const { endpoint = "/api/login", onSuccess, onError } = options;
	const debug = true;

  const submitHandler = async (e: Event) => {
    e.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement | null;

    try {
      const fd = new FormData(form);
      const email = String(fd.get("email") ?? "");
      const password = String(fd.get("password") ?? "");

			if (debug) {
        const mockResult = { email, debug: true };
        onSuccess?.(mockResult);
        form.dispatchEvent(
          new CustomEvent("login-success", { detail: mockResult, bubbles: true })
        );
        return;
      }

      if (!email || !password) {
        onError?.(new Error("Bitte E‑Mail und Passwort eingeben."));
        return;
      }

      if (submitBtn) submitBtn.disabled = true;

			if (!debug) {
				const res = await fetch(endpoint, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ email, password }),
				});
	
				if (!res.ok) {
					const text = await res.text().catch(() => res.statusText);
					throw new Error(text || "Login fehlgeschlagen");
				}
	
				const result = await res.json().catch(() => null);
				onSuccess?.(result);
				form.dispatchEvent(
					new CustomEvent("login-success", { detail: result, bubbles: true })
				);
			}
    } catch (err) {
      console.error(err);
      onError?.(err);
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  };

  form.addEventListener("submit", submitHandler);
  return () => form.removeEventListener("submit", submitHandler);
}
