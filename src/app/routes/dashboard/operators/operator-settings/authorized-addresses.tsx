import { DeletableAddress } from "@/components/operator/operator-permission/deletable-address";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { NavigateBackBtn } from "@/components/ui/navigate-back-btn";
import { useManageAuthorizedAddresses } from "@/hooks/operator/use-manage-authorized-addresses";
import { useOperator } from "@/hooks/operator/use-operator";
import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import { useBlocker } from "react-router";

export const AuthorizedAddresses = () => {
  const formRef = useRef<HTMLDivElement>(null);
  const { data: operator } = useOperator();
  const hasWhitelistedAddresses =
    (operator?.whitelist_addresses || []).length > 0;
  const { addManager, deleteManager, mode, submit, reset, isPending } =
    useManageAuthorizedAddresses();
  const isReachedMaxAddressesCount = addManager.fieldArray.fields.length >= 500;

  const addNewAddressField = () => {
    addManager.fieldArray.append({ value: "" });
    setTimeout(() => {
      formRef.current?.scrollTo({
        top: formRef.current.scrollHeight,
        behavior: "smooth",
      });
    }, 10);
  };

  const handlePaste =
    (index: number) => (e: React.ClipboardEvent<HTMLInputElement>) => {
      const text = e.clipboardData.getData("text");
      const matches = text.match(/0x[a-fA-F0-9]{40}/gm) || [];
      if (matches.length > 1) {
        e.preventDefault();
        addManager.fieldArray.remove(index);
        const mapped = matches.map((value) => ({ value }));
        addManager.fieldArray.append(mapped, { shouldFocus: true });
        addManager.form.trigger("addresses");
      }
    };

  useEffect(() => {
    window.onbeforeunload = () => {
      return mode !== "view"
        ? `Are you sure that you want to cancel? Any unsaved changes will be lost.`
        : undefined;
    };
  }, [mode]);

  const unsavedChangesBlocker = useBlocker(mode !== "view" && !isPending);
  useBlocker(isPending);

  return (
    <Container variant="vertical" size="lg" className="max-h-full py-10">
      <Form {...addManager.form}>
        <NavigateBackBtn />
        {unsavedChangesBlocker.state === "blocked" ? (
          <Button onClick={unsavedChangesBlocker.proceed}>
            Yes i want to leave
          </Button>
        ) : null}
        <Card as="form" onSubmit={submit} className="w-full h overflow-auto">
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-bold">Authorized Addresses</h2>
            <p className="text-sm font-medium text-gray-700">
              Manage the owner addresses that are authorized to register
              validators to your operator?.
              <br />
              Whitelisted addresses are effective only when your operator status
              is set to Private.
            </p>
          </div>
          {(mode === "add" || hasWhitelistedAddresses) &&
            !operator?.is_private && (
              <Alert variant="warning">
                <AlertDescription>
                  In order to enforce whitelisted addresses, make sure to switch
                  the <span className="font-bold">Operator Status</span> to{" "}
                  <span className="font-bold">Private.</span>
                </AlertDescription>
              </Alert>
            )}
          <div ref={formRef} className="space-y-3 overflow-auto">
            {operator?.whitelist_addresses?.map((address) => (
              <DeletableAddress
                key={address}
                address={address}
                onDelete={deleteManager.add}
                onUndo={deleteManager.remove}
                isMarked={deleteManager.isMarked(address)}
                disabled={mode === "add"}
              />
            ))}
            {addManager.fieldArray.fields.map((field, index) => (
              <FormField
                key={field.id}
                control={addManager.form.control}
                name={`addresses.${index}.value`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        onPaste={handlePaste(index)}
                        rightSlot={
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => addManager.fieldArray.remove(index)}
                          >
                            <X className="size-5" />
                          </Button>
                        }
                      />
                    </FormControl>
                    <FormMessage className="text-error-500" />
                  </FormItem>
                )}
              />
            ))}
            {addManager.form.formState.errors.addresses && (
              <FormMessage className="text-error-500">
                {addManager.form.formState.errors.addresses.message}
              </FormMessage>
            )}
            {mode !== "delete" && (
              <button
                disabled={isReachedMaxAddressesCount}
                type="button"
                className="h-12 w-full text-center border border-gray-400 border-dashed rounded-lg text-gray-500 font-medium"
                onClick={addNewAddressField}
              >
                + Add Authorized Address
              </button>
            )}
          </div>

          {mode !== "view" && (
            <div className="flex gap-2 w-full">
              <Button
                type="button"
                className="flex-1"
                size="xl"
                variant="secondary"
                onClick={reset}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                size="xl"
                type="submit"
                isActionBtn
                isLoading={isPending}
                disabled={mode === "add" && addManager.isSubmitDisabled}
              >
                {mode === "delete" ? "Remove and Save" : "Add and Save"}
              </Button>
            </div>
          )}
        </Card>
      </Form>
    </Container>
  );
};
