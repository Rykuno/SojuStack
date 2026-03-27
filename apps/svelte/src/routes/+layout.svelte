<script lang="ts">
  import "./layout.css";
  import favicon from "$lib/assets/favicon.svg";
  import { QueryClientProvider } from "@tanstack/svelte-query";
  import { TanStackDevtoolsCore } from "@tanstack/devtools";

  const { data, children } = $props();

  const devtools = new TanStackDevtoolsCore({
    config: {
      position: "bottom-right",
      hideUntilHover: true
    },
    plugins: [
      {
        name: "Mail",
        render: el => {
          el.innerHTML = `
            <iframe
              src="http://localhost:8025"
              style="width: 100%; height: 100%; border: none;"
            ></iframe>
          )`;
        }
      },
      {
        name: "Drizzle Studio",
        render: el => {
          el.innerHTML = `
            <iframe
              src="https://local.drizzle.studio/"
              style="width: 100%; height: 100%; border: none;"
            ></iframe>
          )`;
        }
      },
      {
        name: "React Email",
        render: el => {
          el.innerHTML = `
            <iframe
              src="http://localhost:3030"
              style="width: 100%; height: 100%; border: none;"
            ></iframe>
          )`;
        }
      },
      {
        name: "OpenAPI",
        render: el => {
          el.innerHTML = `
            <iframe
              src="http://localhost:8000"
              style="width: 100%; height: 100%; border: none;"
            ></iframe>
          )`;
        }
      },
      {
        name: "Rust FS",
        render: el => {
          el.innerHTML = `
            <iframe
              src="http://localhost:9001"
              style="width: 100%; height: 100%; border: none;"
            ></iframe>
          )`;
        }
      }
    ]
  });
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<QueryClientProvider client={data.queryClient}>
  <main>
    {@render children()}
  </main>
  <div use:devtools.mount></div>
</QueryClientProvider>
