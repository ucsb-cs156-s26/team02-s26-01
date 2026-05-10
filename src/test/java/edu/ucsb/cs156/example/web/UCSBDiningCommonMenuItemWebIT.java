package edu.ucsb.cs156.example.web;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

import edu.ucsb.cs156.example.WebTestCase;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("integration")
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class UCSBDiningCommonMenuItemWebIT extends WebTestCase {
  @Test
  public void admin_user_can_create_edit_delete_ucsbdiningcommonmenuitem() throws Exception {
    setupUser(true);

    page.getByText("UCSBDiningCommonMenuItems").click();

    page.getByText("Create UCSBDiningCommonMenuItem").click();
    assertThat(page.getByText("Create New UCSBDiningCommonMenuItem")).isVisible();
    page.getByTestId("UCSBDiningCommonMenuItemForm-name").fill("name1");
    page.getByTestId("UCSBDiningCommonMenuItemForm-diningCommonsCode").fill("diningCommonsCode1");
    page.getByTestId("UCSBDiningCommonMenuItemForm-station").fill("station1");
    page.getByTestId("UCSBDiningCommonMenuItemForm-submit").click();

    assertThat(page.getByTestId("UCSBDiningCommonMenuItemsTable-cell-row-0-col-name"))
        .hasText("name1");

    page.getByTestId("UCSBDiningCommonMenuItemsTable-cell-row-0-col-Edit-button").click();
    assertThat(page.getByText("Edit UCSBDiningCommonMenuItem")).isVisible();
    page.getByTestId("UCSBDiningCommonMenuItemForm-name").fill("name2");
    page.getByTestId("UCSBDiningCommonMenuItemForm-diningCommonsCode").fill("diningCommonsCode2");
    page.getByTestId("UCSBDiningCommonMenuItemForm-station").fill("station2");
    page.getByTestId("UCSBDiningCommonMenuItemForm-submit").click();

    assertThat(page.getByTestId("UCSBDiningCommonMenuItemsTable-cell-row-0-col-name"))
        .hasText("name2");

    page.getByTestId("UCSBDiningCommonMenuItemsTable-cell-row-0-col-Delete-button").click();

    assertThat(page.getByTestId("UCSBDiningCommonMenuItemsTable-cell-row-0-col-name"))
        .not()
        .isVisible();
  }

  @Test
  public void regular_user_cannot_create_ucsbdiningcommonmenuitem() throws Exception {
    setupUser(false);

    page.getByText("UCSBDiningCommonMenuItems").click();

    assertThat(page.getByText("Create UCSBDiningCommonMenuItem")).not().isVisible();
    assertThat(page.getByTestId("UCSBDiningCommonMenuItemsTable-cell-row-0-col-name"))
        .not()
        .isVisible();
  }
}
