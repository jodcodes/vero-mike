import assert from "node:assert/strict";
import test from "node:test";
import { resolveTabularProjectRebind } from "./tabularProjectRebinding";

test("allows null project_id to detach a tabular review", async () => {
    let checked = false;

    const result = await resolveTabularProjectRebind(null, async () => {
        checked = true;
        return false;
    });

    assert.deepEqual(result, { ok: true, projectId: null });
    assert.equal(checked, false);
});

test("allows empty project_id to detach a tabular review", async () => {
    let checked = false;

    const result = await resolveTabularProjectRebind("  ", async () => {
        checked = true;
        return false;
    });

    assert.deepEqual(result, { ok: true, projectId: null });
    assert.equal(checked, false);
});

test("rejects rebinding to a project without target project access", async () => {
    const checkedProjectIds: string[] = [];

    const result = await resolveTabularProjectRebind(
        "victim-project",
        async (projectId) => {
            checkedProjectIds.push(projectId);
            return false;
        },
    );

    assert.deepEqual(checkedProjectIds, ["victim-project"]);
    assert.deepEqual(result, {
        ok: false,
        status: 404,
        detail: "Project not found",
    });
});

test("allows rebinding only after target project access passes", async () => {
    const result = await resolveTabularProjectRebind(
        "allowed-project",
        async (projectId) => {
            return projectId === "allowed-project";
        },
    );

    assert.deepEqual(result, { ok: true, projectId: "allowed-project" });
});
