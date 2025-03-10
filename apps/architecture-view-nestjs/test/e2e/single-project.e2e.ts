import { Workbench } from 'wdio-vscode-service';

describe('Architecture view extension', () => {
  it('should load the workspace', async () => {
    const workbench: Workbench = await browser.getWorkbench();
    expect(await workbench.getTitleBar().getTitle()).toContain(
      '[Extension Development Host] guinea-pig-nestjs',
    );
  });

  it('should load the architecture view', async function () {
    const workbench: Workbench = await browser.getWorkbench();
    await workbench.executeCommand('showArchitecture');
    await browser.pause(500);
    const archWebview = await workbench.getWebviewByTitle('Architecture View');
    await archWebview.open();
    await $('.ActualNode').waitForExist({
      timeout: 3 * 60 * 1000,
      timeoutMsg: 'Client took too long to load',
      interval: 500,
    });
    const serviceNodes = await $$('.ActualNode');
    const dbNodes = await $$('.DBNode');
    expect(serviceNodes.length).toBe(6);
    expect(dbNodes.length).toBe(1);
    const nodesText = await Promise.all(serviceNodes.map((node) => node.getText()));
    expect(nodesText).toContain('AppService\ngetHello\ngetWorld');
  });
});
