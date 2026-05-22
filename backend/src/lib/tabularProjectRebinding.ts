export type TabularProjectRebindResult =
    | { ok: true; projectId: string | null }
    | { ok: false; status: 400 | 404; detail: string };

type CheckAccess = (projectId: string) => Promise<boolean>;

export async function resolveTabularProjectRebind(
    rawProjectId: unknown,
    checkAccess: CheckAccess,
): Promise<TabularProjectRebindResult> {
    if (rawProjectId === null) return { ok: true, projectId: null };

    if (typeof rawProjectId !== "string") {
        return {
            ok: false,
            status: 400,
            detail: "project_id must be a string or null",
        };
    }

    const projectId = rawProjectId.trim();
    if (!projectId) return { ok: true, projectId: null };

    if (!(await checkAccess(projectId))) {
        return { ok: false, status: 404, detail: "Project not found" };
    }

    return { ok: true, projectId };
}
